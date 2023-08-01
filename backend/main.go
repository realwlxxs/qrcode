package main

import (
	"crypto/md5"
	"database/sql"
	"encoding/hex"
	"fmt"
	"mime"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/realwlxxs/qrcode/mapper"
	"github.com/realwlxxs/qrcode/middleware"
)

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func MD5WithSalt(payload string, salt string) string {
	hash := md5.New()
	hash.Write([]byte(salt))
	hash.Write([]byte(payload))
	return hex.EncodeToString(hash.Sum(nil))
}

func main() {
	sqlconn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		"localhost",
		5432,
		"postgres",
		"qwertyuiop",
		"mydatabase",
	)

	db, err := sql.Open("postgres", sqlconn)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	mapper.UserInit(db)

	r := gin.Default()
	api := r.Group("api")

	api.POST("register", func(c *gin.Context) {
		json := make(map[string]interface{})
		c.BindJSON(&json)
		rows := mapper.UserQueryPasswordByUsername(db, json["username"].(string))
		defer rows.Close()
		if rows.Next() {
			c.JSON(200, "username has been taken")
		} else {
			mapper.UserCreate(
				db,
				json["username"].(string),
				MD5WithSalt(json["password"].(string), "123"),
			)
		}
	})

	api.POST("login", func(c *gin.Context) {
		json := make(map[string]interface{})
		c.BindJSON(&json)
		rows := mapper.UserQueryPasswordByUsername(db, json["username"].(string))
		defer rows.Close()
		var password string
		if rows.Next() {
			rows.Scan(&password)
			if MD5WithSalt(json["password"].(string), "123") == password {
				var (
					key []byte
					t   *jwt.Token
					s   string
				)
				key = []byte("123456")
				t = jwt.NewWithClaims(jwt.SigningMethodHS256,
					jwt.MapClaims{
						"sub": json["username"],
						"iat": jwt.NewNumericDate(time.Now()),
						"exp": jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
					})
				s, _ = t.SignedString(key)
				c.JSON(200, s)
			} else {
				c.JSON(200, "wrong password")
			}
		} else {
			c.JSON(200, "user not found")
		}
	})

	authorized := api.Group("authorized")
	authorized.Use(middleware.JWTAuthMiddleware())
	{
		authorized.GET("ping", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
	}

	minioClient, _ := minio.New("localhost:9000", &minio.Options{
		Creds:  credentials.NewStaticV4("minioadmin", "minioadmin", ""),
		Secure: false,
	})

	authorized.POST("profile", func(c *gin.Context) {
		file, header, _ := c.Request.FormFile("avatar")
		defer file.Close()
		username, _ := c.Get("username")
		filename := username.(string)
		minioClient.PutObject(
			c.Request.Context(),
			"mybucket",
			filename,
			file,
			-1,
			minio.PutObjectOptions{
				ContentType: mime.TypeByExtension(filepath.Ext(header.Filename)),
			},
		)
		c.JSON(200, filename)
	})

	r.Run()
}
