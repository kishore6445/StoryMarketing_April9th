"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { AdminUserManagement } from "@/components/admin-user-management"
import { ManageClientsSection } from "@/components/manage-clients-section"
import { AdminContentTargets } from "@/components/admin-content-targets"
import { UserProfileSettings } from "@/components/user-profile-settings"

interface Client {
  id: string
  name: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'clients' | 'targets'>('profile')
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(false)

  // Load clients for the content targets component
  useEffect(() => {
    const loadClients = async () => {
      setLoadingClients(true)
      try {
        const token = localStorage.getItem('sessionToken')
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined
        const response = await fetch('/api/clients', { headers })
        if (response.ok) {
          const data = await response.json()
          setClients(data.clients || [])
        }
      } catch (error) {
        console.error('[v0] Failed to load clients:', error)
      } finally {
        setLoadingClients(false)
      }
    }

    loadClients()
  }, [])

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#FAFBFC] p-8">
        {/* Tabs */}
        <div className="mb-6 border-b border-[#E5E5E7]">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'profile'
                ? 'text-[#007AFF]'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            My Profile
            {activeTab === 'profile' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007AFF]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'users'
                ? 'text-[#007AFF]'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            Team Users
            {activeTab === 'users' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007AFF]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('targets')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'targets'
                ? 'text-[#007AFF]'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            Content Targets
            {activeTab === 'targets' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007AFF]" />
            )}
          </button>
          {/* <button
            onClick={() => setActiveTab('clients')}
            className={`pb-3 px-1 font-medium transition-colors relative ${
              activeTab === 'clients'
                ? 'text-[#007AFF]'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
            }`}
          >
            Clients
            {activeTab === 'clients' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#007AFF]" />
            )}
          </button> */}
        </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && <UserProfileSettings />}
        {activeTab === 'users' && <AdminUserManagement />}
        {activeTab === 'targets' && (
          <div className="py-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#1D1D1F]">Platform Content Targets</h2>
              <p className="text-[#86868B] mt-2">Set monthly targets for each platform per client</p>
            </div>
            {loadingClients ? (
              <div className="text-center py-12 text-[#86868B]">Loading clients...</div>
            ) : clients.length > 0 ? (
              <AdminContentTargets clients={clients} />
            ) : (
              <div className="text-center py-12 text-[#86868B]">No clients found. Create clients first.</div>
            )}
          </div>
        )}
        {activeTab === 'clients' && <ManageClientsSection />}
      </div>
    </AuthGuard>
  )
}
