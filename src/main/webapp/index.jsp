<!doctype html>
<html lang="en">
<head>
    <%@ page contentType="text/html;charset=UTF-8" %>
    <style><%@include file="css/style.css"%></style>
    <script src="js/fetch.js"></script>
    <title>Ucode_Pixelizator</title>
</head>
<body>

    <div class="main">
        <p style="color: #D47720; font-size: 16px">PIXELIZATOR</p>
        <div class="inputs">
            <br>
            <label for="file-upload" class="custom-file-upload">UPLOAD FILE</label>
            <input type="file" id="file-upload" accept="image/png, image/bmp, image/jpeg, image/jpg" onchange="preview_file()"><br><br>
            <input type="range" id="range" min="1" max="100" step="1" value="1" onchange="range_changed('range')">

            <div class="quantity">
                <input type="number" id="range-num" size="3" min="1" max="100" value="1" onchange="range_changed('num')">
                <p style="opacity: 40%; display: inline">1-100</p><br><br><br>
            </div>
        </div>

        <img src="" id="image-res" class="prev-img" alt="Image preview"><br>
        <p id="file-name-label"></p>
        <p id="file-format"></p>
        <p id="file-size"></p><br>
        <p id="error-text"></p><br>
        <button onclick="download_image('png')">png</button>
        <button onclick="download_image('bmp')">bmp</button>
        <button onclick="download_image('jpeg')">jpeg</button>
        <button onclick="download_image('jpg')">jpg</button>
        <br><br><br>
        <a style="float: end; color: #D47720;" href="https://github.com/vrnvv">VVRNV</a>
    </div>
</body>
</html>