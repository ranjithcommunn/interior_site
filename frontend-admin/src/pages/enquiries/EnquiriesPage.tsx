import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ShoppingBag, Phone as PhoneIcon, Search } from "lucide-react";
import { Enquiry, fetchEnquiries, updateEnquiryStatus } from "../../api/enquiries";
import { Dropdown } from "../../components/Dropdown";
import { Pagination } from "../../components/Pagination";

const statusOptions: Enquiry["status"][] = ["new", "contacted", "closed"];

const statusStyles: Record<Enquiry["status"], string> = {
  new: "bg-amber-50 text-amber-700",
  contacted: "bg-blue-50 text-blue-700",
  closed: "bg-gray-100 text-gray-500",
};

const sourceStyles: Record<Enquiry["source"], string> = {
  product_enquiry: "bg-violet-50 text-violet-700",
  contact_page: "bg-teal-50 text-teal-700",
};

const sourceOptions = [
  { value: "", label: "All sources" },
  { value: "product_enquiry", label: "Product Enquiry" },
  { value: "contact_page", label: "Contact Page" },
];

const statusFilterOptions = [
  { value: "", label: "All statuses" },
  ...statusOptions.map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) })),
];

export const EnquiriesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [page, setPage] = useState(1);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["enquiries", { search, source, status, page, limit }],
    queryFn: () =>
      fetchEnquiries({
        search: search || undefined,
        source: source || undefined,
        status: status || undefined,
        page,
        limit,
      }),
  });

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Enquiry["status"] }) =>
      updateEnquiryStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["enquiries"] }),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-sm text-gray-500">
          {isLoading ? "Loading..." : `${data?.total ?? 0} enquir${data?.total === 1 ? "y" : "ies"}`}
        </p>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, phone, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 rounded-lg p-2.5 pl-9 text-sm w-64 bg-white outline-none focus:border-black transition-colors"
            />
          </div>
          <Dropdown
            value={source}
            onChange={(v) => {
              setSource(v);
              setPage(1);
            }}
            options={sourceOptions}
          />
          <Dropdown
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={statusFilterOptions}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/80 text-left text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="p-4">Contact</th>
              <th className="p-4">Source</th>
              <th className="p-4">Message</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="p-4 text-gray-400" colSpan={5}>
                  Loading...
                </td>
              </tr>
            ) : data?.enquiries.length === 0 ? (
              <tr>
                <td className="p-8 text-center text-gray-400" colSpan={5}>
                  No enquiries found.
                </td>
              </tr>
            ) : (
              data?.enquiries.map((enq) => (
                <tr key={enq._id} className="border-t border-gray-50 hover:bg-gray-50/50 align-top">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0 uppercase">
                        {enq.name?.[0] ?? "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800">{enq.name}</p>
                        <p className="text-xs text-gray-400">{enq.phone}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[160px]">{enq.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 w-fit ${sourceStyles[enq.source]}`}
                    >
                      {enq.source === "product_enquiry" ? (
                        <ShoppingBag size={11} />
                      ) : (
                        <PhoneIcon size={11} />
                      )}
                      {enq.source === "product_enquiry" ? "Product" : "Contact"}
                    </span>
                    {enq.product && (
                      <p className="text-xs text-gray-500 mt-1.5">
                        Re: <span className="font-medium text-gray-700">{enq.product.title}</span>
                      </p>
                    )}
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="text-sm text-gray-600 line-clamp-2">{enq.message || "—"}</p>
                  </td>
                  <td className="p-4 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(enq.createdAt).toLocaleDateString()}
                    <br />
                    {new Date(enq.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-4">
                    <Dropdown
                      value={enq.status}
                      onChange={(value) =>
                        statusMutation.mutate({ id: enq._id, status: value as Enquiry["status"] })
                      }
                      options={statusOptions.map((s) => ({
                        value: s,
                        label: s[0].toUpperCase() + s.slice(1),
                      }))}
                      buttonClassName={`!border-transparent ${statusStyles[enq.status]}`}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};
