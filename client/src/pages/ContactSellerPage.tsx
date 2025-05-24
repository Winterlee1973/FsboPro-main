import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { type Property, type User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, Calendar, MessageSquare, BellRing, DollarSign, Clock, Home } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/propertyUtils";
import { Helmet } from "react-helmet";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

const scheduleFormSchema = z.object({
  date: z.string().min(1, { message: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
  notes: z.string().optional(),
});

const offerFormSchema = z.object({
  amount: z.string().min(1, { message: "Please enter an offer amount" }),
  notes: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;
type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
type OfferFormValues = z.infer<typeof offerFormSchema>;

export default function ContactSellerPage() {
  const params = useParams<{ id: string }>();
  const propertyId = parseInt(params.id);
  const [, navigate] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("message");
  
  // Get tab from URL query parameter
  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get("tab");
  
  // Set active tab based on URL parameter if present
  useEffect(() => {
    if (tabParam && ["message", "schedule", "offer"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  // Fetch property details
  const {
    data: property,
    isLoading: isPropertyLoading,
    error: propertyError,
  } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !isNaN(propertyId),
  });
  
  // Fetch seller information if property is loaded
  const {
    data: seller,
    isLoading: isSellerLoading,
  } = useQuery<User>({
    queryKey: [property ? `/api/auth/user/${property.userId}` : null],
    enabled: !!property && !!property.userId,
  });
  
  // Redirect if user not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect if invalid ID
  useEffect(() => {
    if (!isNaN(propertyId) && propertyError) {
      navigate("/not-found");
    }
  }, [propertyId, propertyError, navigate]);

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user ? (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "") : "",
      email: user ? user.email || "" : "",
      phone: "",
      message: `I'm interested in this property and would like to learn more...`,
    },
  });
  
  const scheduleForm = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      date: "",
      time: "",
      notes: "I'd like to schedule a walkthrough of the property.",
    },
  });
  
  const offerForm = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      amount: property ? property.price.toString() : "",
      notes: "This is my initial offer for the property.",
    },
  });

  // Update offer form when property loads
  useEffect(() => {
    if (property) {
      offerForm.setValue("amount", property.price.toString());
    }
  }, [property, offerForm]);
  
  const handleContactSubmit = async (values: ContactFormValues) => {
    if (!property?.userId) {
      toast({
        title: "Error",
        description: "Seller information not available.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/messages", {
        toUserId: property.userId,
        propertyId: property.id,
        message: `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone}\n\n${values.message}`,
      });
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the seller.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleScheduleSubmit = async (values: ScheduleFormValues) => {
    if (!property?.userId) {
      toast({
        title: "Error",
        description: "Seller information not available.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/messages", {
        toUserId: property.userId,
        propertyId: property.id,
        message: `WALKTHROUGH REQUEST\nDate: ${values.date}\nTime: ${values.time}\nNotes: ${values.notes}`,
      });
      
      toast({
        title: "Request Sent",
        description: "Your walkthrough request has been sent to the seller.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOfferSubmit = async (values: OfferFormValues) => {
    if (!property) return;
    
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/offers", {
        propertyId: property.id,
        amount: parseFloat(values.amount),
        message: values.notes,
      });
      
      toast({
        title: "Offer Submitted",
        description: "Your offer has been submitted to the seller.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Loading state
  if (isPropertyLoading || isSellerLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8">
            <Skeleton className="h-10 w-48 mb-4" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-10 w-36 mb-4" />
                <Skeleton className="h-40 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full mb-6" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Error state
  if (propertyError || !property) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-secondary mb-2">
                Property Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                The property you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>Contact Seller | {property.title}</title>
        <meta
          name="description"
          content={`Contact the seller about ${property.address}, ${property.city}, ${property.state} - a ${property.bedrooms} bed, ${property.bathrooms} bath property for sale at ${formatPrice(property.price)}`}
        />
      </Helmet>
      
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/property/${property.id}`)}
              className="mb-4"
            >
              <Home className="mr-2 h-4 w-4" /> Back to Property
            </Button>
            <h1 className="text-3xl font-bold text-secondary">
              Contact Seller about {property.address}
            </h1>
            <p className="text-gray-600 mt-2">
              {property.city}, {property.state} {property.zipCode} - {formatPrice(property.price)}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="message" className="text-sm sm:text-base">
                      <MessageSquare className="h-4 w-4 mr-2" /> Message
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="text-sm sm:text-base">
                      <Calendar className="h-4 w-4 mr-2" /> Schedule Visit
                    </TabsTrigger>
                    <TabsTrigger value="offer" className="text-sm sm:text-base">
                      <DollarSign className="h-4 w-4 mr-2" /> Make Offer
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="message" className="mt-0">
                    <Form {...contactForm}>
                      <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={contactForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={contactForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Email</FormLabel>
                                <FormControl>
                                  <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={contactForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={contactForm.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea rows={6} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="schedule" className="mt-0">
                    <Form {...scheduleForm}>
                      <form onSubmit={scheduleForm.handleSubmit(handleScheduleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={scheduleForm.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Date</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={scheduleForm.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Time</FormLabel>
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={scheduleForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Notes</FormLabel>
                              <FormControl>
                                <Textarea rows={6} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Schedule Visit"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                  
                  <TabsContent value="offer" className="mt-0">
                    <Form {...offerForm}>
                      <form onSubmit={offerForm.handleSubmit(handleOfferSubmit)} className="space-y-4">
                        <FormField
                          control={offerForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Offer Amount ($)</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={offerForm.control}
                          name="notes"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Offer Details & Conditions</FormLabel>
                              <FormControl>
                                <Textarea rows={6} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="bg-blue-50 p-4 rounded-md mb-4">
                          <p className="text-sm text-blue-800">
                            <BellRing className="h-4 w-4 inline-block mr-2" />
                            Making an offer through our platform creates a formal record. The seller will be notified immediately.
                          </p>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Offer"}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-6">
                <h2 className="text-xl font-bold text-secondary mb-4">About the Seller</h2>
                {seller && (
                  <div>
                    <div className="flex items-center mb-4">
                      <img 
                        src={seller.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"} 
                        alt={seller.firstName || "Property Owner"} 
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-secondary">
                          {seller.firstName && seller.lastName 
                            ? `${seller.firstName} ${seller.lastName}` 
                            : "Property Owner"}
                        </p>
                        <p className="text-sm text-gray-600">Property Owner</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex items-center mb-3">
                        <Phone className="text-primary mr-3 h-5 w-5" />
                        <span className="text-gray-700">Contact through platform</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <Mail className="text-primary mr-3 h-5 w-5" />
                        <span className="text-gray-700">Message directly</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="text-primary mr-3 h-5 w-5" />
                        <span className="text-gray-700">Typically responds within 24 hours</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
                <h2 className="text-xl font-bold text-secondary mb-4">Property Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">{formatPrice(property.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium capitalize">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bedrooms:</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bathrooms:</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium">{property.squareFeet.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built:</span>
                    <span className="font-medium">{property.yearBuilt || "Not specified"}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/property/${property.id}`)}
                    >
                      View Full Property Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}