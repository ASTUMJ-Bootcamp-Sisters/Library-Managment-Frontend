import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import useAuthStore from '../store/authStore';
import useMembershipStore from '../store/membershipStore';

export default function Membership() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { 
    membership, 
    loading, 
    error, 
    emailVerificationStatus,
    getMembershipStatus, 
    requestMembership, 
    requestEmailOtp, 
    verifyEmailOtp 
  } = useMembershipStore();
  
  const [activeTab, setActiveTab] = useState('status');
  const [formData, setFormData] = useState({
    paymentMethod: 'online',
    paymentAmount: 50,
    paymentReference: ''
  });
  const [files, setFiles] = useState({
    idCard: null,
    paymentImage: null
  });
  const [otpValue, setOtpValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch membership status on component mount
    getMembershipStatus().catch(() => {
      // Silence 404 errors as they just mean no membership yet
    });
  }, [getMembershipStatus]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error
      });
    }
  }, [error, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('paymentMethod', formData.paymentMethod);
    data.append('paymentAmount', formData.paymentAmount);
    data.append('paymentReference', formData.paymentReference);
    
    if (files.idCard) {
      data.append('idCard', files.idCard);
    } else {
      toast({
        variant: "destructive",
        title: "Missing File",
        description: "Please upload your ID card image"
      });
      setIsSubmitting(false);
      return;
    }
    
    if (files.paymentImage) {
      data.append('paymentImage', files.paymentImage);
    } else {
      toast({
        variant: "destructive",
        title: "Missing File",
        description: "Please upload your payment screenshot"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await requestMembership(data);
      toast({
        title: "Success",
        description: response.message || "Membership request submitted successfully"
      });
      setActiveTab('status');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit membership request"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestOtp = async () => {
    try {
      await requestEmailOtp();
      toast({
        title: "OTP Sent",
        description: "Check your email for the verification code"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send verification code"
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the verification code"
      });
      return;
    }
    
    try {
      await verifyEmailOtp(otpValue);
      toast({
        title: "Success",
        description: "Email verified successfully"
      });
      // Refresh membership status
      getMembershipStatus();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to verify email"
      });
    }
  };


  return (
    <div className="min-h-screen w-full flex flex-col justify-start items-center p-6 bg-gradient-to-b from-[#f3e7dd] via-[#e4d0bf] to-[#e9d1c0]">
      <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] shadow-xl rounded-2xl border border-[#e3c1ab] p-8">
        <h1 className="text-3xl font-bold mb-6 text-[#4a2c1a] font-serif">Library Membership</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="status">Membership Status</TabsTrigger>
            <TabsTrigger value="request" disabled={membership?.status === "Pending" || membership?.status === "Active"}>
              Request Membership
            </TabsTrigger>
            <TabsTrigger value="verification" disabled={user?.emailVerified}>
              Verify Email
            </TabsTrigger>
          </TabsList>
          <TabsContent value="status" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Membership Status</CardTitle>
                <CardDescription>
                  View your current membership status and details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {membership?.status ? membership.status : "No membership found"}
                    {membership && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">Membership Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p><span className="font-medium">Status:</span> {membership.status}</p>
                            {membership.status === "Active" && (
                              <>
                                <p><span className="font-medium">Expiry Date:</span> {new Date(membership.expiryDate).toLocaleDateString()}</p>
                                <p><span className="font-medium">Last Payment Date:</span> {new Date(membership.lastPaymentDate).toLocaleDateString()}</p>
                              </>
                            )}
                            <p><span className="font-medium">Email Verified:</span> {membership.isEmailVerified ? "Yes" : "No"}</p>
                          </div>
                          <div className="space-y-2">
                            <p><span className="font-medium">Payment Method:</span> {membership.paymentMethod}</p>
                            <p><span className="font-medium">Payment Amount:</span> ${membership.paymentAmount}</p>
                            {membership.paymentReference && (
                              <p><span className="font-medium">Payment Reference:</span> {membership.paymentReference}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
              {!membership && (
                <CardFooter>
                  <Button onClick={() => setActiveTab('request')}>Request Membership</Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          <TabsContent value="request" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Request New Membership</CardTitle>
                <CardDescription>
                  Submit the required information to request a library membership
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="idCard">ID Card Image</Label>
                    <Input 
                      id="idCard" 
                      name="idCard" 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange} 
                      required 
                    />
                    <p className="text-sm text-gray-500">Please upload a clear image of your ID card</p>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Label htmlFor="paymentAmount">Payment Amount (minimum $50)</Label>
                    <Input 
                      id="paymentAmount" 
                      name="paymentAmount" 
                      type="number" 
                      min="50"
                      value={formData.paymentAmount} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select 
                      id="paymentMethod" 
                      name="paymentMethod" 
                      value={formData.paymentMethod} 
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="online">Online</option>
                      <option value="card">Card</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentReference">Payment Reference (if applicable)</Label>
                    <Input 
                      id="paymentReference" 
                      name="paymentReference" 
                      value={formData.paymentReference} 
                      onChange={handleInputChange} 
                      placeholder="Transaction ID, receipt number, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentImage">Payment Screenshot</Label>
                    <Input 
                      id="paymentImage" 
                      name="paymentImage" 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange} 
                      required 
                    />
                    <p className="text-sm text-gray-500">Please upload a screenshot of your payment receipt</p>
                  </div>
                  {!user?.emailVerified && (
                    <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Email Verification Required</h3>
                          <p className="mt-2 text-sm text-yellow-700">
                            You need to verify your email before your membership can be approved. Please go to the Email Verification tab after submitting your request.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⭘</span>
                        Submitting...
                      </>
                    ) : (
                      "Submit Membership Request"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="verification" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Verification</CardTitle>
                <CardDescription>
                  Verify your email address to complete your membership process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user?.emailVerified ? (
                  <div className="rounded-md bg-green-50 p-4 border border-green-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Email Verified</h3>
                        <p className="mt-2 text-sm text-green-700">
                          Your email address has been verified successfully.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                      <p className="text-sm text-blue-700">
                        To complete your membership registration, you need to verify your email address. Click the button below to receive a verification code.
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <Button 
                        onClick={handleRequestOtp} 
                        disabled={emailVerificationStatus.loading || emailVerificationStatus.isRequested}
                        className="w-full"
                      >
                        {emailVerificationStatus.loading ? (
                          <>
                            <span className="animate-spin mr-2">⭘</span>
                            Sending...
                          </>
                        ) : emailVerificationStatus.isRequested ? (
                          "Verification Code Sent"
                        ) : (
                          "Send Verification Code"
                        )}
                      </Button>
                      {emailVerificationStatus.isRequested && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <Label htmlFor="otp">Enter Verification Code</Label>
                            <Input 
                              id="otp" 
                              value={otpValue} 
                              onChange={(e) => setOtpValue(e.target.value)} 
                              placeholder="Enter 6-digit code"
                              maxLength={6}
                            />
                          </div>
                          <Button 
                            onClick={handleVerifyOtp} 
                            disabled={!otpValue || emailVerificationStatus.loading}
                          >
                            {emailVerificationStatus.loading ? (
                              <>
                                <span className="animate-spin mr-2">⭘</span>
                                Verifying...
                              </>
                            ) : (
                              "Verify Code"
                            )}
                          </Button>
                          <p className="text-sm text-gray-500 mt-2">
                            Didn't receive the code? {" "}
                            <button 
                              type="button"
                              onClick={handleRequestOtp}
                              disabled={emailVerificationStatus.loading}
                              className="text-primary hover:underline focus:outline-none"
                            >
                              Resend
                            </button>
                          </p>
                        </>
                      )}
                      {emailVerificationStatus.error && (
                        <div className="rounded-md bg-red-50 p-4 border border-red-200">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-700">
                                {emailVerificationStatus.error}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
