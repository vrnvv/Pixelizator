# Pixelizator

The Pixelizer of the Picture is a web application that leverages technologies like Tomcat and Servlets to transform images into pixelated versions.
With this tool, users can upload an image, specify pixelation settings using a range slider, and generate a pixelated rendition of the original image. 

# Instruction

**To run like local app**

- Install apache tomcat from https://tomcat.apache.org/download-90.cgi or install it via packet manager
- Enter the command `./mvn clean package` in project root
- Run >> `java -jar target/dependency/webapp-runner.jar target/*.war`
- Go to http://localhost:8080/
- Enjoy