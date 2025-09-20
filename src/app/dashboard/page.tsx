
"use client"
import Link from "next/link"
import {
  Bell,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  Users,
  PlusCircle,
  Upload,
  Loader2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import React, { useState } from "react"
import { analyzeUploadedImage, AnalyzeUploadedImageOutput } from "@/ai/flows/analyze-uploaded-image-for-crop-damage"
import { generateClaimReport } from "@/ai/flows/generate-claim-report-from-damage-analysis"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"


type Claim = {
  id: string;
  crop: string;
  damageType: string;
  status: 'Pending' | 'Analyzed' | 'Reported';
  dateFiled: string;
  analysis?: AnalyzeUploadedImageOutput;
  reportSummary?: string;
};


export default function DashboardPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeUploadedImageOutput | null>(null);
  const [claimDetails, setClaimDetails] = useState({ crop: '', description: '' });
  const { toast } = useToast();

  const handleFileClaim = async () => {
    if (!imageFile || !claimDetails.crop) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please upload an image and specify the crop type.",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = async () => {
        const photoDataUri = reader.result as string;

        const analysis = await analyzeUploadedImage({ photoDataUri });
        setAnalysisResult(analysis);
        toast({
          title: "Analysis Complete",
          description: "Crop damage analysis has been successfully completed.",
        });
      };
    } catch (error) {
      console.error("Analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing the crop damage.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!analysisResult) {
      toast({
        variant: "destructive",
        title: "No Analysis Data",
        description: "Please analyze an image before generating a report.",
      });
      return;
    }
    setIsGeneratingReport(true);
    try {
      const damageDetails = `Damage Type: ${analysisResult.damageType}, Extent: ${analysisResult.damageExtent}. Notes: ${analysisResult.additionalNotes}`;
      const estimatedLoss = "To be determined by adjuster."; // Placeholder

      const report = await generateClaimReport({ damageDetails, estimatedLoss });

      const newClaim: Claim = {
        id: `CLM-${String(claims.length + 1).padStart(4, '0')}`,
        crop: claimDetails.crop,
        damageType: analysisResult.damageType,
        status: 'Reported',
        dateFiled: new Date().toLocaleDateString(),
        analysis: analysisResult,
        reportSummary: report.reportSummary,
      };

      setClaims(prevClaims => [newClaim, ...prevClaims]);
      toast({
        title: "Report Generated",
        description: "The claim report has been successfully generated and filed.",
      });
      resetDialog();
      setIsDialogOpen(false);

    } catch (error) {
      console.error("Report generation failed:", error);
      toast({
        variant: "destructive",
        title: "Report Generation Failed",
        description: "There was an error generating the claim report.",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };


  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const resetDialog = () => {
    setUploadedImage(null);
    setImageFile(null);
    setAnalysisResult(null);
    setClaimDetails({ crop: '', description: '' });
  };


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Link
              href="#"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">CropClaim AI</span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Claims</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Claims</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Users className="h-5 w-5" />
                  <span className="sr-only">Customers</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Customers</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LineChart className="h-5 w-5" />
                  <span className="sr-only">Analytics</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">CropClaim AI</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Claims
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="archived" className="hidden sm:flex">
                  Archived
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
              <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
                  setIsDialogOpen(isOpen);
                  if (!isOpen) {
                    resetDialog();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                      <PlusCircle />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        File New Claim
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] grid-rows-[auto_1fr_auto]">
                    <DialogHeader>
                      <DialogTitle>File New Claim</DialogTitle>
                      <DialogDescription>
                        Upload a photo of the crop damage and provide details to start the claim process.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      { !analysisResult ? (
                        <>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="crop-type">Crop Type</Label>
                            <Input id="crop-type" placeholder="e.g., Corn, Wheat, Soybeans" value={claimDetails.crop} onChange={(e) => setClaimDetails({...claimDetails, crop: e.target.value})} />
                          </div>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="picture">Damage Photo</Label>
                            <div className="flex items-center gap-4">
                              <div className="w-full aspect-video rounded-md border-2 border-dashed border-muted-foreground/40 flex items-center justify-center relative">
                                {uploadedImage ? (
                                  <Image src={uploadedImage} alt="Uploaded crop" layout="fill" objectFit="cover" className="rounded-md" />
                                ) : (
                                  <div className="text-center text-muted-foreground">
                                    <Upload className="mx-auto h-8 w-8" />
                                    <p className="mt-2 text-sm">Click to upload or drag & drop</p>
                                  </div>
                                )}
                                <Input id="picture" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                              </div>
                            </div>
                          </div>
                          <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea id="description" placeholder="Provide any additional details about the damage." value={claimDetails.description} onChange={(e) => setClaimDetails({...claimDetails, description: e.target.value})} />
                          </div>
                        </>
                      ) : (
                        <div>
                          <Card>
                            <CardHeader>
                              <CardTitle>Analysis Results</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                              {uploadedImage && <Image src={uploadedImage} alt="Uploaded crop" width={500} height={281} className="rounded-md" />}
                              <div className="grid grid-cols-2 gap-2">
                                <p><strong>Damage Type:</strong></p><p>{analysisResult.damageType}</p>
                                <p><strong>Damage Extent:</strong></p><p>{analysisResult.damageExtent}</p>
                              </div>
                              <p><strong>Additional Notes:</strong> {analysisResult.additionalNotes}</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" onClick={resetDialog}>Cancel</Button>
                      </DialogClose>
                      { !analysisResult ? (
                        <Button onClick={handleFileClaim} disabled={isAnalyzing || !imageFile || !claimDetails.crop}>
                          {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isAnalyzing ? "Analyzing..." : "Analyze Damage"}
                        </Button>
                      ) : (
                        <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
                          {isGeneratingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isGeneratingReport ? "Generating..." : "Generate Claim Report"}
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Claims</CardTitle>
                  <CardDescription>
                    Manage and view your crop damage claims.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Claim ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Crop
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Damage Type
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Date Filed
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {claims.length > 0 ? (
                        claims.map((claim) => (
                          <TableRow key={claim.id}>
                            <TableCell className="font-medium">{claim.id}</TableCell>
                            <TableCell>
                              <Badge variant={claim.status === 'Reported' ? 'default' : 'secondary'}>{claim.status}</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{claim.crop}</TableCell>
                            <TableCell className="hidden md:table-cell">{claim.damageType}</TableCell>
                            <TableCell className="hidden md:table-cell">{claim.dateFiled}</TableCell>
                            <TableCell>
                               <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Download Report</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center h-24">No claims filed yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
    

    