import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Mail, Phone } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { type User, type Property } from "@shared/schema";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactSellerProps {
  property: Property;
  seller?: User;
}

export function ContactSeller({ property, seller }: ContactSellerProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: `I'm interested in this property and would like to learn more...`,
    },
  });
  
  const onSubmit = async (values: ContactFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Sign In",
        description: "You need to sign in to contact the seller.",
        variant: "destructive",
      });
      return;
    }
    
    if (!property.userId) {
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
      
      form.reset({
        name: "",
        email: "",
        phone: "",
        message: `I'm interested in this property and would like to learn more...`,
      });
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
  
  return (
    <div className="border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-bold text-secondary mb-4">Contact the Seller</h2>
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-2/3">
          <div className="bg-gray-50 p-6 rounded-lg">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea rows={4} {...field} />
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
          </div>
        </div>
        {seller && (
          <div className="w-full md:w-1/3">
            <div className="bg-gray-50 p-6 rounded-lg">
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
                <div className="flex items-center">
                  <Mail className="text-primary mr-3 h-5 w-5" />
                  <span className="text-gray-700">Message directly above</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Typically responds within 24 hours</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
