import { XMLParser } from "fast-xml-parser";

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface RSSFeed {
  channel: {
    title: string;
    link: string;
    description: string;
  };
  items: RSSItem[];
}

export async function fetchFeed(url: string): Promise<RSSFeed> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "gator",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.statusText}`);
  }

  const xmlText = await response.text();

  const parser = new XMLParser();
  const jsonObj = parser.parse(xmlText);

  const channel = jsonObj.rss?.channel;
  if (!channel) {
    throw new Error("Invalid RSS feed: Missing 'channel' field.");
  }

  const feedTitle = channel.title;
  const feedLink = channel.link;
  const feedDescription = channel.description;

  if (!feedTitle || !feedLink || !feedDescription) {
    throw new Error(
      "Invalid RSS feed: Missing channel metadata (title, link, or description).",
    );
  }

  let items: RSSItem[] = [];
  const rawItems = channel.item;

  if (rawItems) {
    const itemsArray = Array.isArray(rawItems) ? rawItems : [rawItems];

    for (const item of itemsArray) {
      if (item.title && item.link && item.description && item.pubDate) {
        items.push({
          title: item.title,
          link: item.link,
          description: item.description,
          pubDate: item.pubDate,
        });
      }
    }
  }

  return {
    channel: {
      title: feedTitle,
      link: feedLink,
      description: feedDescription,
    },
    items: items,
  };
}
