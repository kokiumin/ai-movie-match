export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'client' | 'creator' | 'admin'
          display_name: string
          handle: string | null
          avatar_url: string | null
          company_name: string | null
          industry: string | null
          bio: string | null
          specialty: string[] | null
          tools: string[] | null
          tags: string[] | null
          badge: string
          turnaround: string | null
          min_price: number | null
          max_price: number | null
          rating: number
          review_count: number
          delivery_count: number
          monthly_revenue: number
          active_projects: number
          stripe_account_id: string | null
          stripe_connected: boolean
          color: string | null
          rank: 'starter' | 'regular' | 'pro' | 'elite'
          total_earnings_30d: number
          total_earnings_90d: number
          completed_orders: number
          rank_updated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'client' | 'creator' | 'admin'
          display_name: string
          handle?: string | null
          avatar_url?: string | null
          company_name?: string | null
          industry?: string | null
          bio?: string | null
          specialty?: string[] | null
          tools?: string[] | null
          tags?: string[] | null
          badge?: string
          turnaround?: string | null
          min_price?: number | null
          max_price?: number | null
          rating?: number
          review_count?: number
          delivery_count?: number
          monthly_revenue?: number
          active_projects?: number
          stripe_account_id?: string | null
          stripe_connected?: boolean
          color?: string | null
          rank?: 'starter' | 'regular' | 'pro' | 'elite'
          total_earnings_30d?: number
          total_earnings_90d?: number
          completed_orders?: number
          rank_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'client' | 'creator' | 'admin'
          display_name?: string
          handle?: string | null
          avatar_url?: string | null
          company_name?: string | null
          industry?: string | null
          bio?: string | null
          specialty?: string[] | null
          tools?: string[] | null
          tags?: string[] | null
          badge?: string
          turnaround?: string | null
          min_price?: number | null
          max_price?: number | null
          rating?: number
          review_count?: number
          delivery_count?: number
          monthly_revenue?: number
          active_projects?: number
          stripe_account_id?: string | null
          stripe_connected?: boolean
          color?: string | null
          rank?: 'starter' | 'regular' | 'pro' | 'elite'
          total_earnings_30d?: number
          total_earnings_90d?: number
          completed_orders?: number
          rank_updated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          client_id: string
          company_name: string | null
          industry: string | null
          type: string
          budget: string | null
          deadline: string | null
          description: string | null
          style: string | null
          pro_select: boolean
          status: 'recruiting' | 'matching' | 'contracted' | 'in_progress' | 'completed' | 'cancelled'
          view_count: number
          proposal_count: number
          completed_at: string | null
          payout_status: 'pending' | 'paid' | 'refunded' | 'disputed'
          payout_completed_at: string | null
          client_approved_at: string | null
          auto_approval_deadline: string | null
          cancelled_at: string | null
          refunded_at: string | null
          disputed_at: string | null
          dispute_resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          company_name?: string | null
          industry?: string | null
          type: string
          budget?: string | null
          deadline?: string | null
          description?: string | null
          style?: string | null
          pro_select?: boolean
          status?: 'recruiting' | 'matching' | 'contracted' | 'in_progress' | 'completed' | 'cancelled'
          view_count?: number
          proposal_count?: number
          completed_at?: string | null
          payout_status?: 'pending' | 'paid' | 'refunded' | 'disputed'
          payout_completed_at?: string | null
          client_approved_at?: string | null
          auto_approval_deadline?: string | null
          cancelled_at?: string | null
          refunded_at?: string | null
          disputed_at?: string | null
          dispute_resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          company_name?: string | null
          industry?: string | null
          type?: string
          budget?: string | null
          deadline?: string | null
          description?: string | null
          style?: string | null
          pro_select?: boolean
          status?: 'recruiting' | 'matching' | 'contracted' | 'in_progress' | 'completed' | 'cancelled'
          view_count?: number
          proposal_count?: number
          completed_at?: string | null
          payout_status?: 'pending' | 'paid' | 'refunded' | 'disputed'
          payout_completed_at?: string | null
          client_approved_at?: string | null
          auto_approval_deadline?: string | null
          cancelled_at?: string | null
          refunded_at?: string | null
          disputed_at?: string | null
          dispute_resolved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      proposals: {
        Row: {
          id: string
          project_id: string
          creator_id: string
          message: string | null
          price: number | null
          delivery_days: number | null
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          creator_id: string
          message?: string | null
          price?: number | null
          delivery_days?: number | null
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          creator_id?: string
          message?: string | null
          price?: number | null
          delivery_days?: number | null
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'proposals_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'proposals_creator_id_fkey'
            columns: ['creator_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      message_threads: {
        Row: {
          id: string
          project_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'message_threads_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      thread_participants: {
        Row: {
          thread_id: string
          user_id: string
          last_read_at: string
        }
        Insert: {
          thread_id: string
          user_id: string
          last_read_at?: string
        }
        Update: {
          thread_id?: string
          user_id?: string
          last_read_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'thread_participants_thread_id_fkey'
            columns: ['thread_id']
            isOneToOne: false
            referencedRelation: 'message_threads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'thread_participants_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          sender_id: string
          text: string
          created_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          sender_id?: string
          text?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'messages_thread_id_fkey'
            columns: ['thread_id']
            isOneToOne: false
            referencedRelation: 'message_threads'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      portfolio_items: {
        Row: {
          id: string
          creator_id: string
          title: string | null
          category: string | null
          description: string | null
          video_url: string | null
          thumbnail_url: string | null
          view_count: number
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          title?: string | null
          category?: string | null
          description?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          view_count?: number
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          title?: string | null
          category?: string | null
          description?: string | null
          video_url?: string | null
          thumbnail_url?: string | null
          view_count?: number
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'portfolio_items_creator_id_fkey'
            columns: ['creator_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      reviews: {
        Row: {
          id: string
          creator_id: string
          author_id: string
          project_id: string | null
          rating: number
          text: string | null
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          author_id: string
          project_id?: string | null
          rating: number
          text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          author_id?: string
          project_id?: string | null
          rating?: number
          text?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_creator_id_fkey'
            columns: ['creator_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'proposal' | 'message' | 'match' | 'review' | 'system'
          text: string
          read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'proposal' | 'message' | 'match' | 'review' | 'system'
          text: string
          read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'proposal' | 'message' | 'match' | 'review' | 'system'
          text?: string
          read?: boolean
          data?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      favorites: {
        Row: {
          user_id: string
          creator_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          creator_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          creator_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'favorites_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'favorites_creator_id_fkey'
            columns: ['creator_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      creator_rank_history: {
        Row: {
          id: string
          creator_id: string
          previous_rank: 'starter' | 'regular' | 'pro' | 'elite' | null
          new_rank: 'starter' | 'regular' | 'pro' | 'elite'
          reason: string | null
          earnings_30d: number | null
          earnings_90d: number | null
          completed_orders: number | null
          created_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          previous_rank?: 'starter' | 'regular' | 'pro' | 'elite' | null
          new_rank: 'starter' | 'regular' | 'pro' | 'elite'
          reason?: string | null
          earnings_30d?: number | null
          earnings_90d?: number | null
          completed_orders?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          previous_rank?: 'starter' | 'regular' | 'pro' | 'elite' | null
          new_rank?: 'starter' | 'regular' | 'pro' | 'elite'
          reason?: string | null
          earnings_30d?: number | null
          earnings_90d?: number | null
          completed_orders?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'creator_rank_history_creator_id_fkey'
            columns: ['creator_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      client_creator_relations: {
        Row: {
          client_id: string
          creator_id: string
          transaction_count: number
          total_amount: number
          first_transaction_at: string | null
          last_transaction_at: string | null
        }
        Insert: {
          client_id: string
          creator_id: string
          transaction_count?: number
          total_amount?: number
          first_transaction_at?: string | null
          last_transaction_at?: string | null
        }
        Update: {
          client_id?: string
          creator_id?: string
          transaction_count?: number
          total_amount?: number
          first_transaction_at?: string | null
          last_transaction_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'client_creator_relations_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'client_creator_relations_creator_id_fkey'
            columns: ['creator_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Proposal = Database['public']['Tables']['proposals']['Row']
export type MessageThread = Database['public']['Tables']['message_threads']['Row']
export type ThreadParticipant = Database['public']['Tables']['thread_participants']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type CreatorRankHistory = Database['public']['Tables']['creator_rank_history']['Row']
export type ClientCreatorRelation = Database['public']['Tables']['client_creator_relations']['Row']

// Enum type aliases
export type UserRole = 'client' | 'creator' | 'admin'
export type CreatorRank = 'starter' | 'regular' | 'pro' | 'elite'
export type PayoutStatus = 'pending' | 'paid' | 'refunded' | 'disputed'
export type ProjectStatus = 'recruiting' | 'matching' | 'contracted' | 'in_progress' | 'completed' | 'cancelled'

// UI display mapping (English DB enum → Japanese UI label)
export const projectStatusLabel: Record<ProjectStatus, string> = {
  recruiting: '募集中',
  matching: 'マッチング中',
  contracted: '成立済み',
  in_progress: '進行中',
  completed: '完了',
  cancelled: 'キャンセル',
}

// Reverse mapping (Japanese UI label → English DB enum)
export const projectStatusFromLabel: Record<string, ProjectStatus> = {
  '募集中': 'recruiting',
  'マッチング中': 'matching',
  '成立済み': 'contracted',
  '進行中': 'in_progress',
  '完了': 'completed',
  'キャンセル': 'cancelled',
}
export type ProposalStatus = 'pending' | 'accepted' | 'rejected'
export type NotificationType = 'proposal' | 'message' | 'match' | 'review' | 'system'
