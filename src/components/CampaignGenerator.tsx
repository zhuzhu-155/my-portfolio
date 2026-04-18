import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, Image as ImageIcon, Copy, Check, Send } from "lucide-react";
import { generateCampaign, generateCampaignImage, CampaignData } from "@/src/lib/gemini";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export function CampaignGenerator() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [audience, setAudience] = useState("general");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt for your campaign.");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const data = await generateCampaign(prompt, tone, audience);
      setCampaign(data);
      toast.success("Campaign generated successfully!");
    } catch (error) {
      toast.error("Failed to generate campaign. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!campaign?.imagePrompt) return;

    setIsGeneratingImage(true);
    try {
      const imageUrl = await generateCampaignImage(campaign.imagePrompt, imageSize);
      setGeneratedImage(imageUrl);
      toast.success("Visual generated successfully!");
    } catch (error) {
      toast.error("Failed to generate visual. Please try again.");
      console.error(error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <Card className="lg:col-span-4 h-fit sticky top-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Campaign Settings
          </CardTitle>
          <CardDescription>
            Define the parameters for your AI-powered marketing campaign.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">What are you promoting?</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., A new eco-friendly water bottle that keeps drinks cold for 48 hours..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="witty">Witty</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger id="audience">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="tech-savvy">Tech Savvy</SelectItem>
                  <SelectItem value="health-conscious">Health Conscious</SelectItem>
                  <SelectItem value="business-owners">Business Owners</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageSize">Visual Quality</Label>
            <Select value={imageSize} onValueChange={(v: any) => setImageSize(v)}>
              <SelectTrigger id="imageSize">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1K">1K (Standard)</SelectItem>
                <SelectItem value="2K">2K (High Def)</SelectItem>
                <SelectItem value="4K">4K (Ultra HD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleGenerate} 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Campaign
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Output Section */}
      <div className="lg:col-span-8 space-y-8">
        {!campaign && !isGenerating && (
          <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed rounded-xl border-muted-foreground/20 text-muted-foreground bg-muted/5">
            <Sparkles className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">Your campaign will appear here</p>
            <p className="text-sm">Fill in the settings and click generate to start.</p>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-4">
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
            <div className="h-[300px] w-full bg-muted animate-pulse rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-full bg-muted animate-pulse rounded" />
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
            </div>
          </div>
        )}

        {campaign && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Email Content</TabsTrigger>
                <TabsTrigger value="visual">Campaign Visual</TabsTrigger>
                <TabsTrigger value="preview">Live Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6 mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Subject Line Options</h3>
                  <div className="grid gap-3">
                    {campaign.subjectLines.map((subject, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border group">
                        <span className="font-medium">{subject}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => copyToClipboard(subject, i)}
                        >
                          {copiedIndex === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Body Copy</h3>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(campaign.bodyCopy, 99)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Markdown
                    </Button>
                  </div>
                  <Card className="bg-muted/10">
                    <CardContent className="pt-6">
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{campaign.bodyCopy}</ReactMarkdown>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="visual" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Visual Concept</CardTitle>
                    <CardDescription>AI-generated visual description for your campaign.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg border text-sm italic">
                      {campaign.imagePrompt}
                    </div>
                    
                    {!generatedImage ? (
                      <Button 
                        className="w-full" 
                        variant="secondary" 
                        onClick={handleGenerateImage}
                        disabled={isGeneratingImage}
                      >
                        {isGeneratingImage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Visual...
                          </>
                        ) : (
                          <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Generate High-Quality Visual ({imageSize})
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative group rounded-xl overflow-hidden border">
                          <img 
                            src={generatedImage} 
                            alt="Generated Campaign Visual" 
                            className="w-full h-auto object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="secondary" onClick={() => setGeneratedImage(null)}>
                              Regenerate
                            </Button>
                          </div>
                        </div>
                        <Button className="w-full" variant="outline" onClick={() => {
                          const link = document.createElement('a');
                          link.href = generatedImage;
                          link.download = 'campaign-visual.png';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}>
                          Download Image
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="mt-6">
                <Card className="max-w-2xl mx-auto overflow-hidden border-2 shadow-xl">
                  <div className="bg-muted px-4 py-2 border-b flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 text-center text-xs font-medium text-muted-foreground">
                      New Message
                    </div>
                  </div>
                  <div className="p-6 space-y-6 bg-white dark:bg-zinc-950">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Subject: <span className="text-foreground font-medium">{campaign.subjectLines[0]}</span></p>
                      <Separator />
                    </div>
                    
                    {generatedImage && (
                      <img src={generatedImage} alt="Hero" className="w-full h-48 object-cover rounded-lg" />
                    )}
                    
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{campaign.bodyCopy}</ReactMarkdown>
                    </div>
                    
                    <Separator />
                    <div className="flex justify-center">
                      <Button className="rounded-full px-8">Call to Action</Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}
