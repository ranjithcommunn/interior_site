import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Enquiry, fetchEnquiries, updateEnquiryStatus } from "../../api/enquiries";

const statusOptions: Enquiry["status"][] = ["new", "contacted", "closed"];

export const EnquiriesPage: React.FC = () => {
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["enquiries", { source, status }],
    queryFn: () => fetchEnquiries({ source: source || undefined, status: status || undefined }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Enquiry["status"] }) =>
      updateEnquiryStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["enquiries"] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Enquiries</h1>

      <div className="flex gap-3 mb-4">
        <select value={source} onChange={(e) => setSource(e.target.value)} className="border rounded-md p-2 text-sm">
          <option value="">All sources</option>
          <option value="product_enquiry">Product Enquiry</option>
          <option value="contact_page">Contact Page</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded-md p-2 text-sm">
          <option value="">All statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          data?.enquiries.map((enq) => (
            <div key={enq._id} className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{enq.name}</p>
                  <p className="text-sm text-gray-500">
                    {enq.phone} · {enq.email}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                    {enq.source === "product_enquiry" ? "Product Enquiry" : "Contact Page"}
                  </span>
                  <select
                    value={enq.status}
                    onChange={(e) =>
                      statusMutation.mutate({ id: enq._id, status: e.target.value as Enquiry["status"] })
                    }
                    className="border rounded-md p-1 text-sm"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {enq.message && <p className="text-sm text-gray-700 mt-2">{enq.message}</p>}
              {enq.product && (
                <p className="text-xs text-gray-500 mt-2">
                  Re: <span className="font-medium">{enq.product.title}</span>
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">{new Date(enq.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
        {!isLoading && data?.enquiries.length === 0 && (
          <p className="text-gray-500">No enquiries found.</p>
        )}
      </div>
    </div>
  );
};
