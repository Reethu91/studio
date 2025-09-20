
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
  Loader2,
  MoreHorizontal,
  Archive,
  ChevronRight,
  ArrowLeft,
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
import React, { useState, useMemo } from "react"
import { analyzeUploadedImage, AnalyzeUploadedImageOutput } from "@/ai/flows/analyze-uploaded-image-for-crop-damage"
import { generateClaimReport } from "@/ai/flows/generate-claim-report-from-damage-analysis"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { uploadFile } from "@/services/firebase"
import { exampleClaims } from "@/lib/example-claims";


type ClaimStatus = 'Pending' | 'Analyzed' | 'Reported' | 'Archived';

export type Claim = {
  id: string;
  crop: string;
  damageType: string;
  status: ClaimStatus;
  dateFiled: string;
  analysis?: AnalyzeUploadedImageOutput;
  reportSummary?: string;
  imageUrl?: string;
};


export default function DashboardPage() {
  const [claims, setClaims] = useState<Claim[]>(exampleClaims);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeUploadedImageOutput | null>(null);
  const [claimDetails, setClaimDetails] = useState({ crop: '', description: '' });
  const { toast } = useToast();
  const [claimImageUrl, setClaimImageUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isViewClaimOpen, setIsViewClaimOpen] = useState(false);

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

        // Upload image to Firebase Storage
        const filePath = `claims/${new Date().toISOString()}-${imageFile.name}`;
        const downloadURL = await uploadFile(photoDataUri, filePath);
        setClaimImageUrl(downloadURL);


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
        imageUrl: claimImageUrl ?? undefined,
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
    setClaimImageUrl(null);
  };
  
  const handleViewDetails = (claim: Claim) => {
    setSelectedClaim(claim);
    setIsViewClaimOpen(true);
  };

  const handleDownloadReport = (claim: Claim) => {
    if (!claim.reportSummary) return;
    const blob = new Blob([claim.reportSummary], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Claim_Report_${claim.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleArchiveClaim = (claimId: string) => {
    setClaims(claims.map(c => c.id === claimId ? { ...c, status: 'Archived' } : c));
    toast({
      title: "Claim Archived",
      description: `Claim ${claimId} has been moved to the archive.`,
    });
  };

  const filteredClaims = useMemo(() => {
    if (activeTab === 'all') {
      return claims.filter(c => c.status !== 'Archived');
    }
    if (activeTab === 'active') {
       return claims.filter(c => c.status === 'Pending' || c.status === 'Analyzed');
    }
    if (activeTab === 'reported') {
      return claims.filter(c => c.status === 'Reported');
    }
    if (activeTab === 'archived') {
      return claims.filter(c => c.status === 'Archived');
    }
    return claims;
  }, [claims, activeTab]);

  const getStatusVariant = (status: ClaimStatus) => {
    switch (status) {
      case 'Reported':
        return 'default';
      case 'Archived':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 relative group">
       <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('https://picsum.photos/seed/greenery/1920/1080')" }}
        data-ai-hint="tea plantation"
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <aside className="fixed inset-y-0 left-0 z-10 w-14 flex-col border-r bg-background/80 backdrop-blur-sm sm:flex transition-all duration-300 ease-in-out group-hover:w-56">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5 h-full">
           <Link
              href="/dashboard"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base mb-4"
            >
              <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">CropClaim AI</span>
            </Link>
            <div className="flex flex-col items-start gap-2 w-full">
              <Link
                href="/dashboard"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 bg-accent text-accent-foreground transition-all hover:text-primary"
              >
                <Home className="h-5 w-5" />
                <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Dashboard</span>
              </Link>
              <Link
                href="/customers"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <Users className="h-5 w-5" />
                <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Customers</span>
              </Link>
              <Link
                href="/analytics"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all hover:text-primary"
              >
                <LineChart className="h-5 w-5" />
                <span className="overflow-hidden whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">Analytics</span>
              </Link>
            </div>
          <div className="mt-auto flex items-center justify-center p-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <ChevronRight className="h-6 w-6 transform rotate-180" />
          </div>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 z-10 sm:pl-14 transition-all duration-300 ease-in-out group-hover:sm:pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
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
                  href="/dashboard"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">CropClaim AI</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/customers"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="/analytics"
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
              className="w-full rounded-lg bg-background/80 pl-8 md:w-[200px] lg:w-[336px]"
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
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 animate-fade-in-up">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="reported">Reported</TabsTrigger>
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
                      
                      { !analysisResult ? (
                        <>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleFileClaim} disabled={isAnalyzing || !imageFile || !claimDetails.crop}>
                            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isAnalyzing ? "Analyzing..." : "Submit for Analysis"}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="outline" onClick={() => setAnalysisResult(null)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                          </Button>
                          <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
                            {isGeneratingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isGeneratingReport ? "Generating..." : "Generate Claim Report"}
                          </Button>
                        </>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
              <TabsContent value={activeTab}>
                <Card className="bg-background/80 backdrop-blur-sm">
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
                      {filteredClaims.length > 0 ? (
                          filteredClaims.map((claim) => (
                            <TableRow key={claim.id}>
                              <TableCell className="font-medium">{claim.id}</TableCell>
                              <TableCell>
                                <Badge variant={getStatusVariant(claim.status)}>{claim.status}</Badge>
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
                                    <DropdownMenuItem onSelect={() => handleViewDetails(claim)}>View Details</DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleDownloadReport(claim)} disabled={!claim.reportSummary}>Download Report</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {claim.status !== 'Archived' && (
                                       <DropdownMenuItem onSelect={() => handleArchiveClaim(claim.id)} className="text-destructive">
                                          <Archive className="mr-2 h-4 w-4" />
                                          Archive
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">No claims in this category.</TableCell>
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

       <Dialog open={isViewClaimOpen} onOpenChange={setIsViewClaimOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Claim Details: {selectedClaim?.id}</DialogTitle>
              <DialogDescription>
                Review the details of your filed claim.
              </DialogDescription>
            </DialogHeader>
            {selectedClaim && (
              <div className="grid gap-6 py-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Claim Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-2 gap-4">
                     <div>
                       {selectedClaim.imageUrl && <Image src={selectedClaim.imageUrl} alt={`Damage for claim ${selectedClaim.id}`} width={400} height={225} className="rounded-md object-cover aspect-video" />}
                    </div>
                     <div className="grid gap-2 text-sm">
                        <div className="grid grid-cols-[120px_1fr] items-center">
                          <p className="font-semibold">Claim ID:</p>
                          <p>{selectedClaim.id}</p>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center">
                          <p className="font-semibold">Crop Type:</p>
                          <p>{selectedClaim.crop}</p>
                        </div>
                         <div className="grid grid-cols-[120px_1fr] items-center">
                          <p className="font-semibold">Date Filed:</p>
                          <p>{selectedClaim.dateFiled}</p>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] items-center">
                          <p className="font-semibold">Status:</p>
                          <Badge variant={getStatusVariant(selectedClaim.status)}>{selectedClaim.status}</Badge>
                        </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedClaim.analysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Analysis Results</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 text-sm">
                      <div className="grid grid-cols-[120px_1fr] items-center">
                        <p className="font-semibold">Damage Type:</p>
                        <p>{selectedClaim.analysis.damageType}</p>
                      </div>
                      <div className="grid grid-cols-[120px_1fr] items-center">
                        <p className="font-semibold">Damage Extent:</p>
                        <p>{selectedClaim.analysis.damageExtent}</p>
                      </div>
                       <div>
                        <p className="font-semibold">Additional Notes:</p>
                        <p className="text-muted-foreground">{selectedClaim.analysis.additionalNotes}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {selectedClaim.reportSummary && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Generated Report Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{selectedClaim.reportSummary}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewClaimOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}

    