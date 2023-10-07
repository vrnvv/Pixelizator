package com.example.model;

import javax.imageio.ImageIO;
import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.annotation.*;
import java.awt.image.BufferedImage;
import java.io.*;

@WebServlet(name = "upload-servlet", value = "/upload-servlet")
@MultipartConfig
public class UploadServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Part part = request.getPart("file");
        int range = Integer.parseInt(request.getHeader("range"));
        String format = request.getHeader("format");


        BufferedImage source = ConvertToImage(part);
        BufferedImage result = Pixelate.pixelate(source, range);
        ImageIO.write(result, format, response.getOutputStream());
    }

    private BufferedImage ConvertToImage(Part part) throws IOException {
        InputStream inputStream = part.getInputStream();
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();

        int nRead;
        byte[] data = new byte[1024];

        while ((nRead = inputStream.read(data, 0, data.length)) != -1)
            buffer.write(data, 0, nRead);

        inputStream = new ByteArrayInputStream(buffer.toByteArray());
        return ImageIO.read(inputStream);
    }
}
