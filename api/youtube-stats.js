export default async function handler(req, res) {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "YOUTUBE_API_KEY no configurada" });
    }

    const url =
      "https://www.googleapis.com/youtube/v3/channels" +
      "?part=statistics" +
      "&forHandle=@AugustoAguirredj" +
      "&key=" + encodeURIComponent(apiKey);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.items?.length) {
      return res.status(502).json({
        error: "No se pudieron obtener las estadísticas de YouTube"
      });
    }

    const stats = data.items[0].statistics;

    return res.status(200).json({
      views: Number(stats.viewCount || 0),
      subscribers: Number(stats.subscriberCount || 0)
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error consultando YouTube"
    });
  }
}
