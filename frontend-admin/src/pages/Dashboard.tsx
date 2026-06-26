import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FolderTree,
  Package,
  CheckCircle2,
  Inbox,
  ShoppingBag,
  Phone,
  ArrowRight,
} from "lucide-react";
import { fetchDashboardStats } from "../api/dashboard";

const statusColors: Record<string, string> = {
  new: "bg-amber-100 text-amber-700",
  contacted: "bg-blue-100 text-blue-700",
  closed: "bg-gray-100 text-gray-600",
};

export const Dashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  const statCards = [
    {
      label: "Categories",
      value: data?.totalCategories,
      icon: FolderTree,
      color: "bg-violet-50 text-violet-600",
      to: "/categories",
    },
    {
      label: "Products",
      value: data?.totalProducts,
      sub: data ? `${data.activeProducts} active` : undefined,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      to: "/products",
    },
    {
      label: "Total Enquiries",
      value: data?.enquiries.total,
      icon: Inbox,
      color: "bg-emerald-50 text-emerald-600",
      to: "/enquiries",
    },
    {
      label: "New Enquiries",
      value: data?.enquiries.byStatus.new,
      icon: CheckCircle2,
      color: "bg-amber-50 text-amber-600",
      to: "/enquiries?status=new",
    },
  ];

  const statusBreakdown = data
    ? [
        { label: "New", count: data.enquiries.byStatus.new, color: "bg-amber-400" },
        { label: "Contacted", count: data.enquiries.byStatus.contacted, color: "bg-blue-400" },
        { label: "Closed", count: data.enquiries.byStatus.closed, color: "bg-gray-300" },
      ]
    : [];

  const sourceBreakdown = data
    ? [
        {
          label: "Product Enquiries",
          count: data.enquiries.bySource.product_enquiry,
          icon: ShoppingBag,
        },
        { label: "Contact Page", count: data.enquiries.bySource.contact_page, icon: Phone },
      ]
    : [];

  const maxStatusCount = Math.max(1, ...statusBreakdown.map((s) => s.count));

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon size={18} />
                </div>
                <ArrowRight
                  size={15}
                  className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "—" : card.value ?? 0}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
              {card.sub && <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Status breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:col-span-1">
          <h2 className="font-semibold text-sm text-gray-800 mb-5">Enquiries by Status</h2>
          <div className="space-y-4">
            {statusBreakdown.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{s.label}</span>
                  <span className="font-semibold text-gray-800">{s.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.color} transition-all`}
                    style={{ width: `${(s.count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-5 pt-5 space-y-3">
            {sourceBreakdown.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                    <Icon size={14} />
                  </div>
                  <span className="text-sm text-gray-600 flex-1">{s.label}</span>
                  <span className="text-sm font-semibold text-gray-800">{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent enquiries */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-sm text-gray-800">Recent Enquiries</h2>
            <Link to="/enquiries" className="text-xs text-gray-500 hover:text-black flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : data?.recentEnquiries.length === 0 ? (
            <p className="text-sm text-gray-400">No enquiries yet.</p>
          ) : (
            <div className="space-y-1">
              {data?.recentEnquiries.map((enq) => (
                <div
                  key={enq._id}
                  className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
                >
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0 uppercase">
                    {enq.name?.[0] ?? "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{enq.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {enq.source === "product_enquiry"
                        ? enq.product?.title
                          ? `Re: ${enq.product.title}`
                          : "Product enquiry"
                        : "Contact page"}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                      statusColors[enq.status]
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
