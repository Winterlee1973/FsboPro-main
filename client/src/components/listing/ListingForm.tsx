import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { insertPropertySchema } from "../../../../functions/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Upload, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Extend the base insertPropertySchema with additional validation rules
const propertyFormSchema = insertPropertySchema.extend({
  // Add more specific validation
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100, { message: "Title must be less than 100 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  price: z.number().min(1000, { message: "Price must be at least $1,000" }),
  squareFeet: z.number().min(100, { message: "Square feet must be at least 100" }),
  bedrooms: z.number().min(1, { message: "Bedrooms must be at least 1" }),
  bathrooms: z.number().min(1, { message: "Bathrooms must be at least 1" }),
  featuredImage: z.string().url({ message: "Please enter a valid image URL" }).optional(),
});

// Type for the form values based on the schema
type PropertyFormValues = z.infer<typeof propertyFormSchema>;

export function ListingForm() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
  // Default values for the form
  const defaultValues: Partial<PropertyFormValues> = {
    title: "",
    description: "",
    price: 0,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 0,
    propertyType: "House",
    featuredImage: "",
  };
  
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: PropertyFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to create a listing.",
        variant: "destructive",
      });
      
      // Redirect to login page
      window.location.href = "/login";
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add featured image if provided
      if (imageUrl) {
        data.featuredImage = imageUrl;
      }
      
      // Create the property
      const response = await apiRequest("POST", "/api/properties", data);
      const newProperty = await response.json();
      
      toast({
        title: "Listing created",
        description: "Your property has been listed successfully.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/properties`] });
      
      // Redirect to premium upgrade page
      navigate(`/premium-upgrade/${newProperty.id}`);
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isAuthenticated) {
    return (
      <Card className="max-w-xl mx-auto my-8">
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
          <CardDescription>
            You need to be signed in to create a property listing.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <a href="/login">
            <Button>Sign In to Continue</Button>
          </a>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto my-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Property Listing</CardTitle>
          <CardDescription>
            Enter the details for your property. All fields are required unless marked as optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Beautiful 3-Bedroom Home with Garden"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, descriptive title for your property.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your property in detail..."
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Include key features, recent renovations, and what makes your property special.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input
                              type="number"
                              placeholder="299000"
                              className="pl-8"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Condo/Townhouse">Condo/Townhouse</SelectItem>
                            <SelectItem value="Multi-Family">Multi-Family</SelectItem>
                            <SelectItem value="Land">Land</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Property Specifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.5"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="squareFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Square Feet</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location</h3>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="94103" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Featured Image</h3>
                
                <div className="flex flex-col gap-4">
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setImageUrl("")}
                          className="shrink-0"
                        >
                          Clear
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Provide a URL to your property's main image.
                    </FormDescription>
                  </FormItem>
                  
                  {imageUrl && (
                    <div className="mt-2 relative aspect-video w-full max-w-md mx-auto rounded-md overflow-hidden border border-gray-200">
                      <img 
                        src={imageUrl} 
                        alt="Property preview" 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2075&h=1000";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? "Creating Listing..." : "Create Listing"}
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  After creating your listing, you'll have the option to upgrade to a Premium Listing for $999
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
