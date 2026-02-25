'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useRef, useEffect, useCallback } from "react";
import { createAnnouncement, getPosts, deletePosts } from "@/lib/actions";
import { PostData } from "@/lib/local-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Send, CheckCircle2, AlertCircle, FileText, Image as ImageIcon, Upload, Trash2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminPostPage() {
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', message?: string }>({ type: 'idle' });
  const [postType, setPostType] = useState<'text' | 'image'>('text');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Modal state
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'create' | 'delete' | null>(null);
  const [modalPasscode, setModalPasscode] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  // Post management state
  const [posts, setPosts] = useState<PostData[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const fetchPosts = useCallback(async () => {
    setIsRefreshing(true);
    const result = await getPosts();
    if (result.success && result.posts) {
      setPosts(result.posts);
    }
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleActionWithPasscode = async () => {
    if (!modalPasscode) return;
    setModalError(null);

    if (pendingAction === 'delete') {
      setIsDeleting(true);
      const result = await deletePosts(selectedPosts, modalPasscode);
      setIsDeleting(false);

      if (result.success) {
        setSelectedPosts([]);
        fetchPosts();
        setIsPasscodeModalOpen(false);
        setModalPasscode("");
        setStatus({ type: 'success', message: "Posts deleted successfully!" });
      } else {
        setModalError(result.error || "Failed to delete posts");
      }
    } else if (pendingAction === 'create') {
      if (!formRef.current) return;
      
      setStatus({ type: 'loading' });
      const formData = new FormData(formRef.current);
      formData.set('adminKey', modalPasscode);
      formData.append('type', postType);
      
      const result = await createAnnouncement(formData);
      
      if (result.success) {
        setIsPasscodeModalOpen(false);
        setModalPasscode("");
        setStatus({ type: 'success', message: "Announcement posted successfully!" });
        fetchPosts();
      } else {
        setStatus({ type: 'idle' });
        setModalError(result.error || "An error occurred");
      }
    }
  };

  async function handleDeleteSelected() {
    if (selectedPosts.length === 0) return;
    setPendingAction('delete');
    setModalError(null);
    setModalPasscode("");
    setIsPasscodeModalOpen(true);
  }

  const togglePostSelection = (id: string) => {
    setSelectedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const triggerCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingAction('create');
    setModalError(null);
    setModalPasscode("");
    setIsPasscodeModalOpen(true);
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Update the hidden file input so the form action can find it
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (status.type === 'success') {
    return (
      <main className="min-h-screen flex flex-col bg-sky-50/30">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full rounded-[3rem] shadow-2xl text-center p-12 space-y-8">
            <CheckCircle2 className="h-24 w-24 text-emerald-500 mx-auto" />
            <h2 className="text-4xl font-light text-sky-950">Post Created!</h2>
            <p className="text-xl text-slate-500 font-light italic">Your church announcement is now live on the updates page.</p>
            <div className="flex flex-col gap-4">
              <Button asChild className="rounded-full py-8 text-xl font-bold bg-sky-600 hover:bg-sky-700">
                <Link href="/updates">View Updates</Link>
              </Button>
              <Button variant="ghost" onClick={() => {
                setStatus({ type: 'idle' });
                setImagePreview(null);
              }} className="text-sky-600">
                Post Another
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-sky-50/30">
      <Navbar />
      
      <section className="py-20 flex-grow container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-light text-sky-950">Post Announcement</h1>
            <p className="text-2xl text-sky-600/60 font-light italic">Create a new church announcement directly to the website.</p>
          </div>

          <form ref={formRef} onSubmit={triggerCreate}>
            <Card className="rounded-[3.5rem] shadow-2xl border-none overflow-hidden bg-white/80 backdrop-blur-xl p-8 md:p-12 space-y-12">
              
              {/* Type Toggle */}
              <div className="flex bg-sky-50 p-2 rounded-[2rem] w-full max-w-2xl mx-auto relative z-10">
                <button
                  type="button"
                  onClick={() => setPostType('text')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-full transition-all duration-300",
                    postType === 'text' ? "bg-white shadow-lg text-sky-600 font-bold" : "text-sky-400 hover:text-sky-500"
                  )}
                >
                  <FileText className="h-5 w-5" />
                  <span>Text Post</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPostType('image')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 rounded-full transition-all duration-300",
                    postType === 'image' ? "bg-white shadow-lg text-sky-600 font-bold" : "text-sky-400 hover:text-sky-500"
                  )}
                >
                  <ImageIcon className="h-5 w-5" />
                  <span>Poster Post</span>
                </button>
              </div>

              {postType === 'text' ? (
                <div className="grid md:grid-cols-2 gap-12 animate-in fade-in duration-500">
                  {/* Chinese Content */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">標題 (中文)</Label>
                      <Input name="title_zh" required={postType === 'text'} placeholder="例如：本週五團契聚會" className="py-8 text-xl rounded-2xl border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">內容 (中文)</Label>
                      <Textarea name="content_zh" required={postType === 'text'} placeholder="請輸入公告內容..." className="min-h-[300px] p-6 text-xl rounded-[2rem] border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                  </div>

                  {/* English Content */}
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">Title (English)</Label>
                      <Input name="title_en" placeholder="e.g. This Friday Fellowship (optional)" className="py-8 text-xl rounded-2xl border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">Content (English)</Label>
                      <Textarea name="content_en" placeholder="Enter announcement content... (optional)" className="min-h-[300px] p-6 text-xl rounded-[2rem] border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 animate-in fade-in duration-500">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">標題 (中文)</Label>
                      <Input name="title_zh" required={postType === 'image'} placeholder="例如：特別主日崇拜海報" className="py-8 text-xl rounded-2xl border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">Title (English)</Label>
                      <Input name="title_en" placeholder="e.g. Special Service Poster (optional)" className="py-8 text-xl rounded-2xl border-sky-100 focus-visible:ring-sky-200" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-black uppercase tracking-[0.2em] text-sky-500 pl-2">Upload Poster Image</Label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        "border-4 border-dashed rounded-[2.5rem] p-12 text-center space-y-6 transition-all cursor-pointer group",
                        isDragging 
                          ? "border-sky-500 bg-sky-100 scale-[1.02] ring-4 ring-sky-100" 
                          : "border-sky-100 hover:bg-sky-50"
                      )}
                    >
                      {imagePreview ? (
                        <div className="relative aspect-[4/3] max-w-md mx-auto rounded-2xl overflow-hidden shadow-xl">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-6 bg-sky-100 rounded-full w-fit mx-auto group-hover:scale-110 transition-transform">
                            <Upload className="h-10 w-10 text-sky-600" />
                          </div>
                          <p className="text-sky-600 font-bold text-xl">Click or drag image here</p>
                          <p className="text-slate-400 font-light text-sm italic">JPG, PNG or WEBP (max 10MB)</p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        name="image" 
                        ref={fileInputRef}
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden" 
                        required={postType === 'image'}
                      />
                    </div>
                  </div>
                </div>
              )}

              {status.type === 'error' && (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-6 w-6" />
                  <span className="font-medium text-lg">{status.message}</span>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={status.type === 'loading'}
                className="w-full py-12 text-3xl font-bold rounded-full bg-sky-600 hover:bg-sky-700 transition-all shadow-2xl heavenly-glow"
              >
                {status.type === 'loading' ? "Posting..." : "Publish Announcement"}
                <Send className="ml-4 h-8 w-8" />
              </Button>
            </Card>
          </form>

          {/* Post Management Section */}
          <div className="space-y-8 mt-24">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl font-light text-sky-950">Manage Posts</h2>
                <p className="text-xl text-sky-600/60 font-light italic">View and remove existing announcements from the website.</p>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={fetchPosts} 
                  disabled={isRefreshing}
                  className="rounded-full h-12 w-12 p-0 border-sky-100 text-sky-600 hover:bg-sky-50"
                >
                  <RefreshCw className={cn("h-5 w-5", isRefreshing && "animate-spin")} />
                </Button>
                {selectedPosts.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleDeleteSelected}
                    disabled={isDeleting}
                    className="rounded-full px-8 py-6 text-lg font-bold shadow-xl bg-white border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all animate-in slide-in-from-right-4 duration-300"
                  >
                    <Trash2 className="mr-2 h-5 w-5" />
                    Delete ({selectedPosts.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Selected Items Badges */}
            {selectedPosts.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-sky-50/50 rounded-2xl border border-sky-100 animate-in fade-in slide-in-from-top-2">
                <span className="text-sm font-bold text-sky-700 mr-2 flex items-center">Selected:</span>
                {selectedPosts.map(id => {
                  const post = posts.find(p => p.id === id);
                  return (
                    <div key={id} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-sky-200 shadow-sm">
                      <span className="text-xs font-medium text-sky-800 max-w-[150px] truncate">
                        {post?.title_zh || post?.title_en || id}
                      </span>
                      <button 
                        onClick={() => togglePostSelection(id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
                <button 
                  onClick={() => setSelectedPosts([])}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 underline px-2"
                >
                  Clear All
                </button>
              </div>
            )}

            <Card className="rounded-[2rem] shadow-xl border-none overflow-hidden bg-white/60 backdrop-blur-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left table-fixed">
                  <thead className="bg-sky-50/50">
                    <tr>
                      <th className="p-4 w-12 text-center">
                        <input 
                          type="checkbox"
                          className="h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                          checked={selectedPosts.length > 0 && selectedPosts.length === posts.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPosts(posts.map(p => p.id));
                            } else {
                              setSelectedPosts([]);
                            }
                          }}
                        />
                      </th>
                      <th className="p-4 w-32 text-xs font-black uppercase tracking-widest text-sky-500">Date</th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-sky-500">Title (中文)</th>
                      <th className="p-4 text-xs font-black uppercase tracking-widest text-sky-500">Title (EN)</th>
                      <th className="p-4 w-24 text-xs font-black uppercase tracking-widest text-sky-500">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50">
                    {posts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-slate-400 italic">
                          No posts found.
                        </td>
                      </tr>
                    ) : (
                      posts
                        .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                        .map((post) => (
                        <tr key={post.id} className="hover:bg-sky-50/30 transition-colors group">
                          <td className="p-3 text-center">
                            <input 
                              type="checkbox"
                              className="h-4 w-4 rounded border-sky-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                              checked={selectedPosts.includes(post.id)}
                              onChange={() => togglePostSelection(post.id)}
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="font-medium text-sm text-sky-900">{post.publishedAt}</span>
                              <span className="text-[10px] text-slate-400 font-mono truncate">{post.id}</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm font-medium text-slate-700 truncate">{post.title_zh}</td>
                          <td className="p-3 text-sm font-medium text-slate-700 truncate">{post.title_en}</td>
                          <td className="p-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                              post.type === 'image' ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
                            )}>
                              {post.type || 'text'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {posts.length > postsPerPage && (
                <div className="p-4 bg-sky-50/30 border-t border-sky-50 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Showing <span className="font-bold">{(currentPage - 1) * postsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * postsPerPage, posts.length)}</span> of <span className="font-bold">{posts.length}</span> posts
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg h-8 text-xs border-sky-200"
                    >
                      Previous
                    </Button>
                    <div className="flex gap-1 items-center px-2">
                      {(() => {
                        const totalPages = Math.ceil(posts.length / postsPerPage);
                        const pages = [];
                        const showMax = 5;
                        
                        if (totalPages <= showMax + 2) {
                          for (let i = 1; i <= totalPages; i++) pages.push(i);
                        } else {
                          pages.push(1);
                          if (currentPage > 3) pages.push('...');
                          
                          const start = Math.max(2, currentPage - 1);
                          const end = Math.min(totalPages - 1, currentPage + 1);
                          
                          for (let i = start; i <= end; i++) {
                            if (!pages.includes(i)) pages.push(i);
                          }
                          
                          if (currentPage < totalPages - 2) pages.push('...');
                          if (!pages.includes(totalPages)) pages.push(totalPages);
                        }

                        return pages.map((p, i) => (
                          p === '...' ? (
                            <span key={`dots-${i}`} className="px-2 text-sky-400">...</span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setCurrentPage(p as number)}
                              className={cn(
                                "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                                currentPage === p 
                                  ? "bg-sky-600 text-white shadow-md" 
                                  : "hover:bg-sky-100 text-sky-600"
                              )}
                            >
                              {p}
                            </button>
                          )
                        ));
                      })()}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(Math.ceil(posts.length / postsPerPage), prev + 1))}
                      disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                      className="rounded-lg h-8 text-xs border-sky-200"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>

      <Footer />

      {/* Passcode Modal */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-2xl animate-in fade-in duration-500">
          <Card className="max-w-md w-full rounded-[3.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.15)] p-12 space-y-10 animate-in zoom-in-95 duration-500 border-none bg-white relative">
            <div className="text-center space-y-6">
              <div className="bg-amber-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto border border-amber-100 shadow-inner">
                <Lock className="h-10 w-10 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-light text-sky-950">Confirm Action</h3>
                <p className="text-slate-400 font-light italic text-sm">Please verify your identity to {pendingAction === 'delete' ? `permanently remove ${selectedPosts.length} selected post(s)` : 'publish this new announcement'}.</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {modalError && (
                <div className="bg-red-50 text-red-600 p-5 rounded-2xl flex items-center gap-4 animate-in shake-in duration-300 border border-red-100 shadow-sm">
                  <AlertCircle className="h-6 w-6 shrink-0" />
                  <span className="text-sm font-bold tracking-tight">{modalError}</span>
                </div>
              )}

              <div className="relative group">
                <Input 
                  type="password" 
                  autoFocus
                  value={modalPasscode}
                  onChange={(e) => {
                    setModalPasscode(e.target.value);
                    if (modalError) setModalError(null);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleActionWithPasscode()}
                  placeholder="Passcode" 
                  className={cn(
                    "py-10 text-3xl rounded-[2rem] border-sky-50 text-center focus-visible:ring-amber-200 transition-all bg-sky-50/30 placeholder:text-sky-200 font-mono",
                    modalError && "border-red-200 bg-red-50/50 text-red-600 focus-visible:ring-red-200"
                  )}
                />
              </div>
              
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={handleActionWithPasscode}
                  disabled={!modalPasscode || status.type === 'loading' || isDeleting}
                  className={cn(
                    "w-full py-10 text-2xl font-bold rounded-full transition-all shadow-xl heavenly-glow border-2",
                    pendingAction === 'delete' 
                      ? "bg-white text-red-500 border-red-50 hover:bg-red-50" 
                      : "bg-white text-sky-600 border-sky-50 hover:bg-sky-50"
                  )}
                >
                  {status.type === 'loading' || isDeleting ? "Verifying..." : "Confirm & Proceed"}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setIsPasscodeModalOpen(false);
                    setModalPasscode("");
                    setModalError(null);
                    setPendingAction(null);
                  }}
                  className="text-slate-300 hover:text-slate-500 hover:bg-transparent font-light transition-colors py-4"
                >
                  Cancel and return
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
