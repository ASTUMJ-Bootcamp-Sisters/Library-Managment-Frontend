import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import useAuthStore from '../store/AuthStore';
import useMembershipStore from '../store/membershipStore';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

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
    getMembershipStatus().catch(() => {});
  }, [getMembershipStatus]);

  useEffect(() => {
    if (error) {
      toast({ variant: "destructive", title: "Error", description: error });
    }
  }, [error, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles(prev => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('paymentMethod', formData.paymentMethod);
    data.append('paymentAmount', formData.paymentAmount);
    data.append('paymentReference', formData.paymentReference);
    
    if (!files.idCard) {
      toast({ variant: "destructive", title: "Missing File", description: "Upload your ID card image" });
      setIsSubmitting(false); return;
    }
    if (!files.paymentImage) {
      toast({ variant: "destructive", title: "Missing File", description: "Upload your payment screenshot" });
      setIsSubmitting(false); return;
    }
    
    data.append('idCard', files.idCard);
    data.append('paymentImage', files.paymentImage);

    try {
      const response = await requestMembership(data);
      toast({ title: "Success", description: response.message || "Membership request submitted" });
      setActiveTab('status');
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to submit request" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestOtp = async () => {
    try {
      await requestEmailOtp();
      toast({ title: "OTP Sent", description: "Check your email for the verification code" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to send code" });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Enter the verification code" });
      return;
    }
    try {
      await verifyEmailOtp(otpValue);
      toast({ title: "Success", description: "Email verified successfully" });
      getMembershipStatus();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error.message || "Failed to verify email" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf3] py-8 px-6">
      <h1 className="text-3xl font-extrabold text-[#4a2c1a] mb-8">Library Membership</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-md bg-[#f3e8df] p-1 mb-6">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="request" disabled={membership?.status === "Pending" || membership?.status === "Active"}>Request</TabsTrigger>
          <TabsTrigger value="verification" disabled={user?.emailVerified}>Verify Email</TabsTrigger>
        </TabsList>

        {/* Membership Status */}
        <TabsContent value="status" className="space-y-6">
          <Card className="bg-white shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Membership Status
                {membership?.status === "Active" && <CheckCircle className="text-green-500 w-5 h-5" />}
                {membership?.status === "Pending" && <AlertTriangle className="text-yellow-500 w-5 h-5" />}
              </CardTitle>
              <CardDescription>View your current membership details</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : membership ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p><span className="font-semibold">Status:</span> {membership.status}</p>
                    {membership.status === "Active" && (
                      <>
                        <p><span className="font-semibold">Expiry Date:</span> {new Date(membership.expiryDate).toLocaleDateString()}</p>
                        <p><span className="font-semibold">Last Payment:</span> {new Date(membership.lastPaymentDate).toLocaleDateString()}</p>
                      </>
                    )}
                    <p><span className="font-semibold">Email Verified:</span> {membership.isEmailVerified ? "Yes" : "No"}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-semibold">Payment Method:</span> {membership.paymentMethod}</p>
                    <p><span className="font-semibold">Amount Paid:</span> ${membership.paymentAmount}</p>
                    {membership.paymentReference && <p><span className="font-semibold">Reference:</span> {membership.paymentReference}</p>}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No membership found.</p>
              )}
            </CardContent>
            {!membership && (
              <CardFooter>
                <Button onClick={() => setActiveTab('request')}>Request Membership</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* Request Membership */}
        <TabsContent value="request" className="space-y-6">
          <Card className="bg-white shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">Request Membership</CardTitle>
              <CardDescription>Submit your information to request membership</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="idCard">ID Card Image</Label>
                  <Input id="idCard" name="idCard" type="file" accept="image/*" onChange={handleFileChange} required />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="paymentAmount">Payment Amount ($50 minimum)</Label>
                  <Input id="paymentAmount" name="paymentAmount" type="number" min="50" value={formData.paymentAmount} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="input">
                    <option value="online">Online</option>
                    <option value="card">Card</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentReference">Payment Reference</Label>
                  <Input id="paymentReference" name="paymentReference" value={formData.paymentReference} onChange={handleInputChange} placeholder="Transaction ID or receipt" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentImage">Payment Screenshot</Label>
                  <Input id="paymentImage" name="paymentImage" type="file" accept="image/*" onChange={handleFileChange} required />
                </div>
                {!user?.emailVerified && (
                  <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <p className="text-yellow-700 text-sm">
                      You need to verify your email before your membership can be approved. Check the Email Verification tab after submission.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit Request"}</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Email Verification */}
        <TabsContent value="verification" className="space-y-6">
          <Card className="bg-white shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Email Verification</CardTitle>
              <CardDescription>Verify your email to complete membership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user?.emailVerified ? (
                <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-700 font-medium">Email Verified Successfully</p>
                </div>
              ) : (
                <>
                  <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <AlertTriangle className="w-5 h-5 text-blue-500" />
                    <p className="text-blue-700 text-sm">Click below to receive a verification code to your email.</p>
                  </div>
                  <Button onClick={handleRequestOtp} disabled={emailVerificationStatus.loading || emailVerificationStatus.isRequested}>
                    {emailVerificationStatus.loading ? "Sending..." : emailVerificationStatus.isRequested ? "Code Sent" : "Send Verification Code"}
                  </Button>
                  {emailVerificationStatus.isRequested && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="otp">Enter Verification Code</Label>
                      <Input id="otp" value={otpValue} onChange={(e) => setOtpValue(e.target.value)} placeholder="6-digit code" maxLength={6} />
                      <Button onClick={handleVerifyOtp} disabled={!otpValue || emailVerificationStatus.loading}>
                        {emailVerificationStatus.loading ? "Verifying..." : "Verify Code"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
