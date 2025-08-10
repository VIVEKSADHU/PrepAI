"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Newspaper, ExternalLink, Calendar, Clock, Loader2, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"

interface NewsItem {
  id: number
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
  category: string
}

export default function DevNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const newsPromises = []
        
        // Headers for proper API requests
        const headers = {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-US,en;q=0.7',
          'Cache-Control': 'max-age=0',
          'Sec-Ch-Ua': '"Not;A=Brand";v="99", "Brave";v="139", "Chromium";v="139"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-User': '?1',
          'Sec-Gpc': '1',
          'Upgrade-Insecure-Requests': '1',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
        }
        
        // Fetch news from IDs 1 to 10
        for (let i = 1; i <= 10; i++) {
          newsPromises.push(
            fetch(`https://devbytes.co.in/news/${i}`, { 
              headers,
              mode: 'cors',
              credentials: 'omit'
            })
              .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`)
                return res.json()
              })
              .catch((error) => {
                console.warn(`Failed to fetch news ${i}:`, error)
                return null
              })
          )
        }

        const results = await Promise.all(newsPromises)
        const validNews = results
          .filter(result => result && (result.title || result.headline)) // Filter out failed requests
          .map((result, index) => ({
            id: index + 1,
            title: result.title || result.headline || `News Article ${index + 1}`,
            description: result.description || result.content || result.excerpt || result.summary || "Click to read more about this news article.",
            url: result.url || result.link || result.permalink || `https://devbytes.co.in/news/${index + 1}`,
            publishedAt: result.publishedAt || result.published_at || result.date || result.created_at || new Date().toISOString(),
            source: result.source || result.author || result.publisher || "DevBytes",
            category: result.category || result.tag || result.type || result.section || "Technology"
          }))

        // If no valid news found, add some sample data to show the UI works
        if (validNews.length === 0) {
          const sampleNews = Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            title: `Sample Developer News ${i + 1}`,
            description: "This is a sample news item. The actual news content will be loaded from the DevBytes API.",
            url: `https://devbytes.co.in/news/${i + 1}`,
            publishedAt: new Date().toISOString(),
            source: "DevBytes",
            category: "Technology"
          }))
          setNews(sampleNews)
        } else {
          setNews(validNews)
        }
      } catch (err) {
        setError("Failed to fetch news. Please try again later.")
        console.error("Error fetching news:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return "Recent"
    }
  }

  const openNews = (url: string) => {
    window.open(url, '_blank')
  }

  const refreshNews = () => {
    setNews([])
    setError(null)
    setLoading(true)
    // Trigger useEffect to run again
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10"
              >
                <Newspaper className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Dev News
                </h1>
                <p className="text-muted-foreground">
                  Latest developer news and updates from DevBytes
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshNews}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-red-900 dark:text-red-100">Error Loading News</h3>
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.6 }}
              >
                <Card className="h-full border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.publishedAt)}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.source}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openNews(item.url)}
                        className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Read More
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Newspaper className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">No News Available</h3>
            <p className="text-muted-foreground">Check back later for the latest developer news.</p>
          </motion.div>
        )}

        {/* Loading indicator for fetching */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-8"
          >
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-muted-foreground">Fetching latest news...</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
