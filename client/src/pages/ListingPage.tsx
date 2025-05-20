import { ListingForm } from "@/components/listing/ListingForm";
import { Helmet } from "react-helmet";

export default function ListingPage() {
  return (
    <>
      <Helmet>
        <title>Create Your Listing | HomeDirect</title>
        <meta
          name="description"
          content="Create your property listing on HomeDirect. List your property, connect with buyers, and save on agent commissions."
        />
        <meta property="og:title" content="Create Your Listing | HomeDirect" />
        <meta
          property="og:description"
          content="Create your property listing on HomeDirect. List your property, connect with buyers, and save on agent commissions."
        />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-secondary mb-4">
            Create Your Property Listing
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your property details below. After creating your listing, you'll have the option to upgrade
            to a Premium Listing for enhanced visibility and faster sales.
          </p>
        </div>
        
        <ListingForm />
      </div>
    </>
  );
}
