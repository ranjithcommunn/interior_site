import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/categories";
import { fetchProducts } from "../api/products";
import { fetchEnquiries } from "../api/enquiries";

export const Dashboard: React.FC = () => {
  const { data: categories } = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const { data: products } = useQuery({
    queryKey: ["products", { page: 1, limit: 1 }],
    queryFn: () => fetchProducts({ page: 1, limit: 1 }),
  });
  const { data: newEnquiries } = useQuery({
    queryKey: ["enquiries", { status: "new", page: 1, limit: 1 }],
    queryFn: () => fetchEnquiries({ status: "new", page: 1, limit: 1 }),
  });

  const cards = [
    { label: "Categories", value: categories?.length ?? "-" },
    { label: "Products", value: products?.total ?? "-" },
    { label: "New Enquiries", value: newEnquiries?.total ?? "-" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-sm">{card.label}</p>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
