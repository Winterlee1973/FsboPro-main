import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/propertyUtils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DollarSign } from "lucide-react";
import { type Property } from "@shared/schema";

const offerSchema = z.object({
  amount: z.string()
    .min(1, { message: "Amount is required" })
    .refine(val => !isNaN(Number(val.replace(/[,$]/g, ''))), {
      message: "Please enter a valid amount",
    })
    .refine(val => Number(val.replace(/[,$]/g, '')) > 0, {
      message: "Amount must be greater than zero",
    }),
  message: z.string().optional(),
});

type OfferFormValues = z.infer<typeof offerSchema>;

interface SubmitOfferProps {
  property: Property;
}

export function SubmitOffer({ property }: SubmitOfferProps) {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      amount: property.price.toString(),
      message: "",
    },
  });
  
  const onSubmit = async (values: OfferFormValues) => {
    if (!isAuthenticated) {
      toast({
        title: "Please Sign In",
        description: "You need to sign in to submit an offer.",
        variant: "destructive",
      });
      return;
    }
    
    if (user?.id === property.userId) {
      toast({
        title: "Cannot Submit Offer",
        description: "You cannot submit an offer on your own property.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Parse the amount to remove any formatting and convert to a number
      const amountValue = Number(values.amount.replace(/[,$]/g, ''));
      
      await apiRequest("POST", "/api/offers", {
        propertyId: property.id,
        amount: amountValue,
        message: values.message,
      });
      
      toast({
        title: "Offer Submitted",
        description: "Your offer has been sent to the seller.",
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/offers`] });
      
      form.reset({
        amount: property.price.toString(),
        message: "",
      });
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
  
  return (
    <div className="border-t border-gray-200 pt-8 mb-8">
      <h2 className="text-2xl font-bold text-secondary mb-4">Submit an Offer</h2>
      <div className="bg-gray-50 p-6 rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                      </div>
                      <Input
                        {...field}
                        placeholder="1,000,000"
                        className="pl-8"
                        onChange={(e) => {
                          // Allow for formatting as the user types
                          const value = e.target.value.replace(/[,$]/g, '');
                          if (!isNaN(Number(value)) || value === '') {
                            // Format the number with commas for thousands
                            const formattedValue = value === '' ? '' : Number(value).toLocaleString();
                            field.onChange(formattedValue);
                          }
                        }}
                      />
                    </div>
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
                  <FormLabel>Message to Seller</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Include any contingencies or special terms of your offer..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Offer"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Tour Request",
                    description: "Your tour request has been sent to the seller.",
                  });
                }}
              >
                Schedule a Tour
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
