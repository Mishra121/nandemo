package utils

import (
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func CreateS3Session() *s3.S3 {

	Region := os.Getenv("AWS_REGION")
	AccessKeyID := os.Getenv("AWS_ACCESS_KEY_ID")
	AccessKeySecret := os.Getenv("AWS_SECRET_ACCESS_KEY")

	sess := session.Must(session.NewSession(
		&aws.Config{
			Region: aws.String(Region),
			Credentials: credentials.NewStaticCredentials(
				AccessKeyID,
				AccessKeySecret,
				"",
			),
		},
	))

	s3Session := s3.New(sess)
	return s3Session
}
