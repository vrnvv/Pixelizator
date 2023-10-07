package com.example.model;

import java.awt.image.BufferedImage;

public class Pixelate {
    public static BufferedImage pixelate(BufferedImage source, int range) {
        BufferedImage result = new BufferedImage(source.getWidth(), source.getHeight(), source.getType());

        for (int y = 0; y < source.getHeight(); y += range) {
            for (int x = 0; x < source.getWidth(); x += range) {
                int color = source.getRGB(x, y);

                for (int yd = y; yd < y + range && yd < result.getHeight(); yd++) {
                    for (int xd = x; xd < x + range && xd < result.getWidth(); xd++) {
                        result.setRGB(xd, yd, color);
                    }
                }
            }
        }
        return result;
    }

}
