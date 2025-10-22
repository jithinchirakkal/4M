import { 
  LayoutDashboard,
  FileText,
  Package,
  Activity,
  Shield,
  Settings,
  Globe,
  Clock,
  AlertTriangle,
  Database
} from 'lucide-react';

interface NavModule {
  id: string;
  title: string;
  fullName: string;
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  status: 'active' | 'development' | 'beta';
}

export const navModules: NavModule[] = [
  { 
    id: 'dashboard', 
    title: 'Dashboard', 
    fullName: 'System Overview', 
    color: 'from-slate-500 to-slate-600',
    icon: LayoutDashboard,
    description: 'Main system overview and analytics',
    status: 'active'
  },
  { 
    id: 'cm', 
    title: 'CM', 
    fullName: 'Change Management Sheet', 
    color: 'from-blue-500 to-blue-600',
    icon: FileText,
    description: 'Manage change requests and approvals',
    status: 'active'
  },
  { 
    id: 'mmc', 
    title: 'MMC', 
    fullName: 'Material Management Control', 
    color: 'from-green-500 to-green-600',
    icon: Package,
    description: 'Control material specifications and changes',
    status: 'active'
  },
  { 
    id: '4m-cts', 
    title: '4M-CTS', 
    fullName: '4M Change Tracking System', 
    color: 'from-purple-500 to-purple-600',
    icon: Activity,
    description: 'Track all 4M changes in real-time',
    status: 'beta'
  },
  { 
    id: 'cpf', 
    title: 'CPF', 
    fullName: 'Control Plan Framework Sheet', 
    color: 'from-indigo-500 to-indigo-600',
    icon: Shield,
    description: 'Framework for quality control plans',
    status: 'active'
  },
  { 
    id: 'mcs', 
    title: 'MCS', 
    fullName: 'Manufacturing Control System', 
    color: 'from-pink-500 to-pink-600',
    icon: Settings,
    description: 'Control manufacturing processes',
    status: 'development'
  },
  { 
    id: 'pf', 
    title: 'PF', 
    fullName: 'Process Flow Diagram Sheet', 
    color: 'from-teal-500 to-teal-600',
    icon: Globe,
    description: 'Visualize and manage process flows',
    status: 'active'
  },
  { 
    id: 'rcr', 
    title: 'RCR', 
    fullName: 'Retroactive Check Record Sheet', 
    color: 'from-orange-500 to-orange-600',
    icon: Clock,
    description: 'Historical change verification',
    status: 'active'
  },
  { 
    id: 'iic-sar', 
    title: 'IIC-SAR', 
    fullName: 'Incident Investigation Control', 
    color: 'from-red-500 to-red-600',
    icon: AlertTriangle,
    description: 'Investigate and manage incidents',
    status: 'beta'
  },
  { 
    id: 'mmm', 
    title: 'MMM', 
    fullName: 'Manufacturing Management Module', 
    color: 'from-cyan-500 to-cyan-600',
    icon: Database,
    description: 'Comprehensive manufacturing management',
    status: 'development'
  },
    { 
    id: 'cdb', 
    title: 'CDB', 
    fullName: 'Change Display Board', 
    color: 'from-cyan-500 to-cyan-600',
    icon: Database,
    description: '',
    status: 'development'
  },
  { 
    id: '4m', 
    title: '4m', 
    fullName: 'FourMChangeResponsibility', 
    color: 'from-cyan-500 to-cyan-600',
    icon: Database,
    description: 'Comprehensive manufacturing management',
    status: 'development'
  },
    { 
    id: '4MP', 
    title: '4M-PROCEDURE', 
    fullName: 'FourMChangeProcedure', 
    color: 'from-cyan-500 to-cyan-600',
    icon: Database,
    description: 'Comprehensive manufacturing management',
    status: 'development'
  },
      { 
    id: 'valid', 
    title: '4M-Validation', 
    fullName: 'FourMChangeProcedure', 
    color: 'from-cyan-500 to-cyan-600',
    icon: Database,
    description: 'Comprehensive manufacturing management',
    status: 'development'
  },
        { 
    id: 'sps', 
    title: 'suspected', 
    fullName: 'FourMChangeProcedure', 
    color: 'from-cyan-500 to-cyan-600',
    icon: Database,
    description: 'Comprehensive manufacturing management',
    status: 'development'
  }
];