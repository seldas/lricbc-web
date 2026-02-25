'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { addGalleryEvent, getGalleriesAction } from "@/lib/gallery-actions";
import { GalleryEvent } from "@/lib/local-gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lock, Plus, CheckCircle2, AlertCircle, Image as ImageIcon, ExternalLink, Calendar, Tag, Layers } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminGalleryPage() {
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });
  const [galleries, setGalleries] = useState<GalleryEvent[]>([]);
  const [isLoadingGalleries, setIsLoadingGalleries] = useState(true);

  useEffect(() => {
    async function fetchGalleries() {
      try {
        const data = await getGalleriesAction();
        setGalleries(data);
      } catch (e) {
        console.error("Failed to fetch galleries", e);
      } finally {
        setIsLoadingGalleries(false);
      }
    }
    fetchGalleries();
  }, [status.type]); // Refresh list when status changes (e.g., after success)

  async function handleSubmit(formData: FormData) {
    setStatus({ type: 'loading' });
    const result = await addGalleryEvent(formData);
    
    if (result.success) {
      setStatus({ type: 'success', message: "Gallery added successfully!" });
      // Reset form or redirect? Let's just reset status after 3 seconds or keep success view
      setTimeout(() => setStatus({ type: 'idle' }), 3000);
    } else {
      setStatus({ type: 'error', message: result.error || "An error occurred" });
    }
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      
      <section className="py-20 flex-grow container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-light text-sky-950 tracking-tight">Gallery Management</h1>
            <p className="text-2xl text-sky-600/60 font-light italic">Create and manage your church's digital memories.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            
            {/* Form Section */}
            <div className="lg:col-span-3 space-y-8">
              <form action={handleSubmit}>
                <Card className="rounded-[3.5rem] shadow-2xl border-none overflow-hidden bg-white p-8 md:p-12 space-y-10">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-sky-100 rounded-2xl">
                      <Plus className="h-6 w-6 text-sky-600" />
                    </div>
                    <h2 className="text-3xl font-light text-sky-950">Add New Gallery</h2>
                  </div>

                  {/* Admin Protection */}
                  <div className="bg-amber-50/50 p-8 rounded-[2.5rem] border border-amber-100 space-y-4">
                    <div className="flex items-center gap-3 text-amber-700 font-black uppercase tracking-widest text-sm">
                      <Lock className="h-4 w-4" />
                      <span>Security Authorization</span>
                    </div>
                    <Input 
                      name="adminKey" 
                      type="password" 
                      required 
                      placeholder="Enter Admin Passcode" 
                      className="bg-white border-amber-200 py-8 text-2xl rounded-2xl focus-visible:ring-amber-300"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">Unique ID (e.g. Easter_2023)</Label>
                      <Input name="id" required placeholder="No spaces, use underscores" className="py-7 text-lg rounded-2xl border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">Category</Label>
                      <Select name="category" defaultValue="fellowship">
                        <SelectTrigger className="py-7 text-lg rounded-2xl border-sky-100 focus-visible:ring-sky-200 bg-white">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-sky-100">
                          <SelectItem value="fellowship">Fellowship</SelectItem>
                          <SelectItem value="holiday">Holiday</SelectItem>
                          <SelectItem value="worship">Worship</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">標題 (中文)</Label>
                      <Input name="title_zh" required placeholder="例如：2023 復活節活動" className="py-7 text-lg rounded-2xl border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">Title (English)</Label>
                      <Input name="title_en" required placeholder="e.g. 2023 Easter Event" className="py-7 text-lg rounded-2xl border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">Date</Label>
                      <Input name="date" type="date" required className="py-7 text-lg rounded-2xl border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">Google Photos URL (Optional)</Label>
                      <Input name="googlePhotosUrl" placeholder="https://photos.app.goo.gl/..." className="py-7 text-lg rounded-2xl border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                  </div>

                  {status.type === 'error' && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="h-6 w-6" />
                      <span className="font-medium text-lg">{status.message}</span>
                    </div>
                  )}

                  {status.type === 'success' && (
                    <div className="bg-emerald-50 text-emerald-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                      <CheckCircle2 className="h-6 w-6" />
                      <span className="font-medium text-lg">{status.message}</span>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={status.type === 'loading'}
                    className="w-full py-10 text-2xl font-bold rounded-full bg-sky-600 hover:bg-sky-700 transition-all shadow-xl shadow-sky-100"
                  >
                    {status.type === 'loading' ? "Creating Gallery..." : "Create Gallery Album"}
                  </Button>
                </Card>
              </form>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between border-b border-sky-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-sky-100 rounded-2xl">
                    <Layers className="h-6 w-6 text-sky-600" />
                  </div>
                  <h3 className="text-2xl font-light text-sky-950 uppercase tracking-widest">Active Albums</h3>
                </div>
                <span className="bg-sky-100 text-sky-600 px-4 py-1 rounded-full text-xs font-black">
                  {galleries.length}
                </span>
              </div>

              <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoadingGalleries ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto" />
                  </div>
                ) : galleries.length === 0 ? (
                  <p className="text-center py-12 text-slate-400 italic font-light">No galleries found in metadata.</p>
                ) : (
                  galleries.map((gallery) => (
                    <Card key={gallery.id} className="rounded-3xl border-sky-50 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                      <div className="flex gap-4 p-4">
                        <div className="h-20 w-20 relative rounded-xl overflow-hidden shrink-0 bg-slate-100">
                          <img src={gallery.thumbnail} alt="" className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-grow min-w-0 space-y-1">
                          <h4 className="font-bold text-sky-900 truncate group-hover:text-sky-600 transition-colors">{gallery.title_en}</h4>
                          <p className="text-xs text-sky-500 font-medium">{gallery.title_zh}</p>
                          <div className="flex items-center gap-3 pt-1">
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                              <Calendar className="h-3 w-3" />
                              <span>{gallery.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                              <Tag className="h-3 w-3" />
                              <span>{gallery.category}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild className="shrink-0 rounded-full text-sky-400 hover:text-sky-600 hover:bg-sky-50">
                          <Link href={`/gallery/${gallery.id}`} target="_blank">
                            <ExternalLink className="h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
