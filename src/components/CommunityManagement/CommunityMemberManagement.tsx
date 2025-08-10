'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Pagination
} from '@nextui-org/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  UserMinus, 
  Shield, 
  ShieldCheck,
  Crown,
  Star,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface CommunityMember {
  id: string;
  userId: string;
  username: string;
  walletAddress: string;
  role: 'creator' | 'admin' | 'moderator' | 'member';
  joinedAt: string;
  lastActive: string;
  pointsBalance: number;
  tasksCompleted: number;
  achievementsCount: number;
  status: 'active' | 'inactive' | 'banned' | 'pending';
  permissions: {
    canManagePoints: boolean;
    canManageAchievements: boolean;
    canManageMembers: boolean;
    canModerateContent: boolean;
    canViewAnalytics: boolean;
  };
}

interface CommunityMemberManagementProps {
  communityId: string;
  currentUserRole: 'creator' | 'admin' | 'moderator' | 'member';
}

const CommunityMemberManagement: React.FC<CommunityMemberManagementProps> = ({
  communityId,
  currentUserRole
}) => {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<CommunityMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isRoleModalOpen, onOpen: onRoleModalOpen, onClose: onRoleModalClose } = useDisclosure();
  const { isOpen: isRemoveModalOpen, onOpen: onRemoveModalOpen, onClose: onRemoveModalClose } = useDisclosure();

  useEffect(() => {
    fetchMembers();
  }, [communityId]);

  useEffect(() => {
    filterMembers();
  }, [members, searchQuery, roleFilter, statusFilter]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockMembers: CommunityMember[] = [
        {
          id: '1',
          userId: 'user1',
          username: 'CommunityCreator',
          walletAddress: '0x1234...5678',
          role: 'creator',
          joinedAt: '2024-01-01T00:00:00Z',
          lastActive: '2024-01-20T10:30:00Z',
          pointsBalance: 5000,
          tasksCompleted: 25,
          achievementsCount: 8,
          status: 'active',
          permissions: {
            canManagePoints: true,
            canManageAchievements: true,
            canManageMembers: true,
            canModerateContent: true,
            canViewAnalytics: true
          }
        },
        {
          id: '2',
          userId: 'user2',
          username: 'AdminUser',
          walletAddress: '0x2345...6789',
          role: 'admin',
          joinedAt: '2024-01-02T00:00:00Z',
          lastActive: '2024-01-20T09:15:00Z',
          pointsBalance: 3500,
          tasksCompleted: 18,
          achievementsCount: 6,
          status: 'active',
          permissions: {
            canManagePoints: true,
            canManageAchievements: true,
            canManageMembers: true,
            canModerateContent: true,
            canViewAnalytics: false
          }
        },
        {
          id: '3',
          userId: 'user3',
          username: 'ModeratorUser',
          walletAddress: '0x3456...7890',
          role: 'moderator',
          joinedAt: '2024-01-05T00:00:00Z',
          lastActive: '2024-01-19T16:45:00Z',
          pointsBalance: 2100,
          tasksCompleted: 12,
          achievementsCount: 4,
          status: 'active',
          permissions: {
            canManagePoints: false,
            canManageAchievements: false,
            canManageMembers: false,
            canModerateContent: true,
            canViewAnalytics: false
          }
        },
        {
          id: '4',
          userId: 'user4',
          username: 'RegularMember',
          walletAddress: '0x4567...8901',
          role: 'member',
          joinedAt: '2024-01-10T00:00:00Z',
          lastActive: '2024-01-18T14:20:00Z',
          pointsBalance: 850,
          tasksCompleted: 7,
          achievementsCount: 2,
          status: 'active',
          permissions: {
            canManagePoints: false,
            canManageAchievements: false,
            canManageMembers: false,
            canModerateContent: false,
            canViewAnalytics: false
          }
        }
      ];
      
      setMembers(mockMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchQuery) {
      filtered = filtered.filter(member =>
        member.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    setFilteredMembers(filtered);
    setCurrentPage(1);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'creator':
        return <Crown className="w-4 h-4" />;
      case 'admin':
        return <ShieldCheck className="w-4 h-4" />;
      case 'moderator':
        return <Shield className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'creator':
        return 'warning';
      case 'admin':
        return 'primary';
      case 'moderator':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'banned':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const canManageMember = (member: CommunityMember): boolean => {
    if (currentUserRole === 'creator') return true;
    if (currentUserRole === 'admin' && member.role !== 'creator') return true;
    return false;
  };

  const handleMemberAction = (member: CommunityMember, action: string) => {
    setSelectedMember(member);
    
    switch (action) {
      case 'view':
        onDetailsOpen();
        break;
      case 'changeRole':
        onRoleModalOpen();
        break;
      case 'remove':
        onRemoveModalOpen();
        break;
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (!selectedMember) return;
    
    try {
      // TODO: API call to update member role
      console.log(`Changing role of ${selectedMember.username} to ${newRole}`);
      
      setMembers(prev => prev.map(member =>
        member.id === selectedMember.id
          ? { ...member, role: newRole as any }
          : member
      ));
      
      onRoleModalClose();
    } catch (error) {
      console.error('Error updating member role:', error);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;
    
    try {
      // TODO: API call to remove member
      console.log(`Removing member ${selectedMember.username}`);
      
      setMembers(prev => prev.filter(member => member.id !== selectedMember.id));
      
      onRemoveModalClose();
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Community Members</h2>
              <p className="text-gray-600">Manage your community members and their roles</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                color="primary"
                startContent={<UserPlus className="w-4 h-4" />}
                size="sm"
              >
                Invite Members
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search members..."
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:max-w-xs"
            />
            
            <Select
              placeholder="Filter by role"
              selectedKeys={[roleFilter]}
              onSelectionChange={(keys) => setRoleFilter(Array.from(keys)[0] as string)}
              className="md:max-w-xs"
            >
              <SelectItem key="all">All Roles</SelectItem>
              <SelectItem key="creator">Creator</SelectItem>
              <SelectItem key="admin">Admin</SelectItem>
              <SelectItem key="moderator">Moderator</SelectItem>
              <SelectItem key="member">Member</SelectItem>
            </Select>
            
            <Select
              placeholder="Filter by status"
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => setStatusFilter(Array.from(keys)[0] as string)}
              className="md:max-w-xs"
            >
              <SelectItem key="all">All Status</SelectItem>
              <SelectItem key="active">Active</SelectItem>
              <SelectItem key="inactive">Inactive</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="banned">Banned</SelectItem>
            </Select>
          </div>

          {/* Members Table */}
          <Table aria-label="Community members table">
            <TableHeader>
              <TableColumn>MEMBER</TableColumn>
              <TableColumn>ROLE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>POINTS</TableColumn>
              <TableColumn>ACTIVITY</TableColumn>
              <TableColumn>JOINED</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={member.username}
                        size="sm"
                        className="flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{member.username}</p>
                        <p className="text-xs text-gray-500">
                          {member.walletAddress.slice(0, 6)}...{member.walletAddress.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      startContent={getRoleIcon(member.role)}
                      color={getRoleColor(member.role)}
                      variant="flat"
                      size="sm"
                    >
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(member.status)}
                      variant="flat"
                      size="sm"
                    >
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{member.pointsBalance.toLocaleString()}</p>
                      <p className="text-gray-500">{member.achievementsCount} achievements</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{member.tasksCompleted} tasks</p>
                      <p className="text-gray-500">
                        Last active {new Date(member.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="view"
                          onPress={() => handleMemberAction(member, 'view')}
                        >
                          View Details
                        </DropdownItem>
                        {canManageMember(member) && (
                          <>
                            <DropdownItem
                              key="changeRole"
                              onPress={() => handleMemberAction(member, 'changeRole')}
                            >
                              Change Role
                            </DropdownItem>
                            <DropdownItem
                              key="remove"
                              className="text-danger"
                              color="danger"
                              onPress={() => handleMemberAction(member, 'remove')}
                            >
                              Remove Member
                            </DropdownItem>
                          </>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={totalPages}
                page={currentPage}
                onChange={setCurrentPage}
                showControls
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* Member Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="2xl">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Member Details</h3>
          </ModalHeader>
          <ModalBody>
            {selectedMember && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar
                    name={selectedMember.username}
                    size="lg"
                  />
                  <div>
                    <h4 className="text-lg font-semibold">{selectedMember.username}</h4>
                    <p className="text-gray-600">{selectedMember.walletAddress}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Role</p>
                    <Chip
                      startContent={getRoleIcon(selectedMember.role)}
                      color={getRoleColor(selectedMember.role)}
                      variant="flat"
                    >
                      {selectedMember.role.charAt(0).toUpperCase() + selectedMember.role.slice(1)}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Chip
                      color={getStatusColor(selectedMember.status)}
                      variant="flat"
                    >
                      {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                    </Chip>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Points Balance</p>
                    <p className="font-semibold">{selectedMember.pointsBalance.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tasks Completed</p>
                    <p className="font-semibold">{selectedMember.tasksCompleted}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Achievements</p>
                    <p className="font-semibold">{selectedMember.achievementsCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="font-semibold">{new Date(selectedMember.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Permissions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedMember.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="text-sm">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDetailsClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Role Change Modal */}
      <Modal isOpen={isRoleModalOpen} onClose={onRoleModalClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Change Member Role</h3>
          </ModalHeader>
          <ModalBody>
            {selectedMember && (
              <div className="space-y-4">
                <p>
                  Change role for <strong>{selectedMember.username}</strong>
                </p>
                <Select
                  label="New Role"
                  placeholder="Select a role"
                  defaultSelectedKeys={[selectedMember.role]}
                >
                  {currentUserRole === 'creator' && (
                    <SelectItem key="admin">Admin</SelectItem>
                  )}
                  <SelectItem key="moderator">Moderator</SelectItem>
                  <SelectItem key="member">Member</SelectItem>
                </Select>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onRoleModalClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={() => handleRoleChange('admin')}>
              Update Role
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Remove Member Modal */}
      <Modal isOpen={isRemoveModalOpen} onClose={onRemoveModalClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Remove Member</h3>
          </ModalHeader>
          <ModalBody>
            {selectedMember && (
              <p>
                Are you sure you want to remove <strong>{selectedMember.username}</strong> from the community?
                This action cannot be undone.
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onRemoveModalClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleRemoveMember}>
              Remove Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CommunityMemberManagement;