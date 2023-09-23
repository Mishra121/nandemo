package utils

import (
	"bytes"
	"crypto/tls"
	"strconv"

	// "crypto/tls"
	"fmt"
	"html/template"
	"log"
	"os"
	"path/filepath"

	// "github.com/k3a/html2text"
	"github.com/joho/godotenv"
	"github.com/k3a/html2text"
	"gopkg.in/gomail.v2"
)

type EmailData struct {
	URL       string
	FirstName string
	Subject   string
}

// ? Email template parser
func ParseTemplateDir(dir string) (*template.Template, error) {
	var paths []string
	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() {
			paths = append(paths, path)
		}
		return nil
	})

	fmt.Println("Am parsing templates...")

	if err != nil {
		return nil, err
	}

	return template.ParseFiles(paths...)
}

func SendEmail(toEmail string, data *EmailData, templateName string) error {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		return err
	}

	from_email_env := os.Getenv("FROMEMAIL")
	smtp_pass_env := os.Getenv("SMTP_PASS")
	smtp_host_env := os.Getenv("SMTP_HOST")
	smtp_port_env := os.Getenv("SMTP_PORT")

	from := from_email_env
	smtpPass := smtp_pass_env
	to := toEmail
	smtpHost := smtp_host_env

	smtpPort, err := strconv.Atoi(smtp_port_env)
	if err != nil {
		log.Fatal("smtp port not found")
		return err
	}

	var body bytes.Buffer

	template, err := ParseTemplateDir("templates")
	if err != nil {
		log.Fatal("Could not parse template", err)
	}

	template = template.Lookup(templateName)
	template.Execute(&body, &data)

	m := gomail.NewMessage()

	m.SetHeader("From", from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", data.Subject)
	m.SetBody("text/html", body.String())
	m.AddAlternative("text/plain", html2text.HTML2Text(body.String()))

	d := gomail.NewDialer(smtpHost, smtpPort, from, smtpPass)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	// Send Email
	if err := d.DialAndSend(m); err != nil {
		log.Println(err.Error(), "err here")
		return err
	}
	return nil
}
