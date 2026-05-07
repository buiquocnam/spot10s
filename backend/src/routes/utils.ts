import { Router } from "express";

const router = Router();

router.get("/crawl", async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    
    const finalUrl = response.url;
    const html = await response.text();

    // 1. Bóc tách Tên từ <title>
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    let name = titleMatch ? titleMatch[1].replace(" - Google Maps", "").trim() : null;

    // 2. Bóc tách Tọa độ từ URL cuối cùng
    const pinLatMatch = finalUrl.match(/!3d(-?\d+\.\d+)/) || finalUrl.match(/!2d(-?\d+\.\d+)/);
    const pinLngMatch = finalUrl.match(/!4d(-?\d+\.\d+)/) || finalUrl.match(/!1d(-?\d+\.\d+)/);
    const centerMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

    let lat = null;
    let lng = null;

    if (pinLatMatch && pinLngMatch) {
      lat = parseFloat(pinLatMatch[1]);
      lng = parseFloat(pinLngMatch[1]);
    } else if (centerMatch) {
      lat = parseFloat(centerMatch[1]);
      lng = parseFloat(centerMatch[2]);
    }

    // 3. Bóc tách Địa chỉ (thường nằm trong thẻ meta description hoặc og:description)
    const descMatch = html.match(/<meta property="og:description" content="(.*?)"/);
    let address = descMatch ? descMatch[1].trim() : null;
    
    // Nếu description bắt đầu bằng "★", đó thường là rating, địa chỉ nằm sau dấu " · "
    if (address && address.includes(" · ")) {
      const parts = address.split(" · ");
      if (parts.length > 1) {
        address = parts[1]; // Phần sau rating và số lượng review
      }
    }

    res.json({ 
      success: true,
      data: {
        name,
        address,
        lat,
        lng,
        finalUrl
      }
    });
  } catch (error) {
    console.error("Crawl error:", error);
    res.status(500).json({ error: "Failed to crawl link data" });
  }
});

export default router;
