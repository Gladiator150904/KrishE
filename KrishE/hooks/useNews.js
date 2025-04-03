import { useState, useEffect, useContext, useCallback } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import Constants from "expo-constants";

const API_KEY=Constants.expoConfig.extra.NEWS_API_KEY;

const useNews = () => {
  const { lang } = useContext(LanguageContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const languageMap = {
    en: 'en',
    hi: 'hi',
    pu: 'hi',
    gu: 'hi',
    ba: 'hi',
    od: 'hi',
    ta: 'ta',
    te: 'te',
    ma: 'ml',
  };

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const language = languageMap[lang] || 'en';
      const url = `https://gnews.io/api/v4/search?q=agriculture+AND+farming&lang=${language}&country=in&max=100&apikey=${API_KEY}`;

      console.log('Fetching news from:', url);

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      console.log('API Response:', data);

      setArticles(data.articles || []); // Handle missing `articles` key
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { articles, loading, fetchNews };
};

export default useNews;
