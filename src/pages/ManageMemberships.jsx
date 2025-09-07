import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import useMembershipStore from '../store/membershipStore';

export default function ManageMemberships() {
  const { toast } = useToast();
  const { 
    memberships, 
    loading, 
    error, 
    getAllMemberships, 
    approveMembership, 
    rejectMembership,
    deleteMembership 
  } = useMembershipStore();
  
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'approve', 'reject', 'delete'
  const [expiryMonths, setExpiryMonths] = useState(1);
  const [rejectionReason, setRejectionReason] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  useEffect(() => {
    getAllMemberships();
  }, [getAllMemberships]);
  
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error
      });
    }
  }, [error, toast]);
  
  const openDialog = (type, membership) => {
    setDialogType(type);
    setSelectedMembership(membership);
    setDialogOpen(true);
    
    // Reset form values
    if (type === 'approve') {
      setExpiryMonths(1);
    } else if (type === 'reject') {
      setRejectionReason('');
    }
  };
  
  const openDetails = (membership) => {
    setSelectedMembership(membership);
    setDetailsOpen(true);
  };
  
  const handleAction = async () => {
    try {
      if (dialogType === 'approve') {
        await approveMembership(selectedMembership._id, expiryMonths);
        toast({
          title: "Success",
          description: "Membership approved successfully"
        });
      } else if (dialogType === 'reject') {
        await rejectMembership(selectedMembership._id, rejectionReason);
        toast({
          title: "Success",
          description: "Membership rejected successfully"
        });
      } else if (dialogType === 'delete') {
        await deleteMembership(selectedMembership._id);
        toast({
          title: "Success",
          description: "Membership deleted successfully"
        });
      }
      setDialogOpen(false);
      // Refresh memberships
      getAllMemberships();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process request"
      });
    }
  };
  
  const getFilteredMemberships = () => {
    if (!memberships) return [];
    
    switch (activeTab) {
      case 'pending':
        return memberships.filter(m => m.status === 'Pending');
      case 'active':
        return memberships.filter(m => m.status === 'Active');
      case 'rejected':
        return memberships.filter(m => m.status === 'Rejected');
      case 'expired':
        return memberships.filter(m => m.status === 'Expired');
      default:
        return memberships;
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'Active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'Rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>;
      case 'Expired':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Expired</span>;
      default:
        return null;
    }
  };
  
  const filteredMemberships = getFilteredMemberships();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Memberships</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{activeTab === 'all' ? 'All Memberships' : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Memberships`}</CardTitle>
              <CardDescription>
                Manage library membership requests and active memberships
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : filteredMemberships.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No memberships found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Email Verified</TableHead>
                        <TableHead>ID Card</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMemberships.map((membership) => (
                        <TableRow key={membership._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{membership.user?.fullName || 'Unknown User'}</p>
                              <p className="text-sm text-gray-500">{membership.user?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(membership.status)}</TableCell>
                          <TableCell>
                            {membership.isEmailVerified ? (
                              <span className="text-green-600">✓ Verified</span>
                            ) : (
                              <span className="text-red-600">✗ Not Verified</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {membership.idCardImage ? (
                              <a href={`http://localhost:5000/${membership.idCardImage.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">
                                <img src={`http://localhost:5000/${membership.idCardImage.replace(/\\/g, '/')}`} alt="ID Card" className="w-12 h-12 object-cover rounded shadow border" />
                              </a>
                            ) : (
                              <span className="text-gray-400">No Image</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {membership.paymentImage ? (
                              <a href={`http://localhost:5000/${membership.paymentImage.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">
                                <img src={`http://localhost:5000/${membership.paymentImage.replace(/\\/g, '/')}`} alt="Payment" className="w-12 h-12 object-cover rounded shadow border" />
                              </a>
                            ) : (
                              <span className="text-gray-400">No Image</span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(membership.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-[#5c4033] to-[#7b5e57] text-white font-semibold shadow hover:from-[#7b5e57] hover:to-[#5c4033] px-4 py-2 rounded-full border-2 border-[#e6d5c3] transition-all duration-200"
                                onClick={() => openDetails(membership)}
                              >
                                View Details
                              </Button>
                              {membership.status === 'Pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => openDialog('approve', membership)}
                                    disabled={!membership.isEmailVerified}
                                    title={!membership.isEmailVerified ? "Email must be verified first" : "Approve membership"}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => openDialog('reject', membership)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => openDialog('delete', membership)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialog for approve/reject/delete actions */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {dialogType === 'approve' && (
            <>
              <DialogHeader>
                <DialogTitle>Approve Membership</DialogTitle>
                <DialogDescription>
                  Set the membership expiry period for this user.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryMonths">Membership Duration (months)</Label>
                  <Input 
                    id="expiryMonths" 
                    type="number" 
                    min="1" 
                    max="12" 
                    value={expiryMonths} 
                    onChange={(e) => setExpiryMonths(parseInt(e.target.value))} 
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    The membership will be valid until {new Date(new Date().setMonth(new Date().getMonth() + parseInt(expiryMonths))).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAction}>Approve Membership</Button>
              </DialogFooter>
            </>
          )}
          
          {dialogType === 'reject' && (
            <>
              <DialogHeader>
                <DialogTitle>Reject Membership</DialogTitle>
                <DialogDescription>
                  Provide a reason for rejecting this membership request.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">Rejection Reason</Label>
                  <textarea 
                    id="rejectionReason" 
                    value={rejectionReason} 
                    onChange={(e) => setRejectionReason(e.target.value)} 
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                    placeholder="Explain why this membership request is being rejected"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleAction}>Reject Membership</Button>
              </DialogFooter>
            </>
          )}
          
          {dialogType === 'delete' && (
            <>
              <DialogHeader>
                <DialogTitle>Delete Membership</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this membership record? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Warning</h3>
                      <p className="mt-2 text-sm text-red-700">
                        This will permanently delete the membership record and any associated files.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleAction}>Delete Membership</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* User Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg bg-gradient-to-br from-[#fffaf3] via-[#fdf0e0] to-[#e6c9a9] rounded-2xl shadow-lg p-0">
          {selectedMembership && (
            <div className="max-h-[80vh] overflow-y-auto p-6 sm:p-8 flex flex-col gap-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-extrabold text-[#4a2c1a] tracking-wide font-serif drop-shadow-lg mb-2">User Details</DialogTitle>
                <DialogDescription className="text-[#7b5e57] mb-4">Full info and submitted images</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <span className="font-semibold text-[#5c4033]">Name:</span> {selectedMembership.user?.fullName}<br/>
                  <span className="font-semibold text-[#5c4033]">Email:</span> {selectedMembership.user?.email}
                </div>
                <div>
                  <span className="font-semibold text-[#5c4033]">Status:</span> {selectedMembership.status}<br/>
                  <span className="font-semibold text-[#5c4033]">Email Verified:</span> {selectedMembership.isEmailVerified ? 'Yes' : 'No'}
                </div>
                <div>
                  <span className="font-semibold text-[#5c4033]">Payment Amount:</span> {selectedMembership.paymentAmount}<br/>
                  <span className="font-semibold text-[#5c4033]">Payment Method:</span> {selectedMembership.paymentMethod}<br/>
                  <span className="font-semibold text-[#5c4033]">Payment Reference:</span> {selectedMembership.paymentReference}
                </div>
                <div>
                  <span className="font-semibold text-[#5c4033]">ID Card Image:</span><br/>
                  {selectedMembership.idCardImage ? (
                    <img src={`http://localhost:5000/${selectedMembership.idCardImage.replace(/\\/g, '/')}`} alt="ID Card" className="w-full max-w-xs h-auto rounded shadow border mt-2 mx-auto" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-[#5c4033]">Payment Image:</span><br/>
                  {selectedMembership.paymentImage ? (
                    <img src={`http://localhost:5000/${selectedMembership.paymentImage.replace(/\\/g, '/')}`} alt="Payment" className="w-full max-w-xs h-auto rounded shadow border mt-2 mx-auto" />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-[#5c4033]">Submitted:</span> {new Date(selectedMembership.createdAt).toLocaleString()}
                </div>
              </div>
              <DialogFooter>
                <Button className="bg-gradient-to-r from-[#5c4033] to-[#7b5e57] text-white font-semibold shadow hover:from-[#7b5e57] hover:to-[#5c4033] px-6 py-2 rounded-full border-2 border-[#e6d5c3] transition-all duration-200" onClick={() => setDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
