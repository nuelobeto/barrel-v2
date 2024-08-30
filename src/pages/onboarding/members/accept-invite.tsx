import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {ROUTES} from '@/router/routes';
import memberServices from '@/services/memberServices';
import {InviteDetailsType} from '@/types/members';
import {useMutation} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {useNavigate, useParams} from 'react-router-dom';

export function AcceptInvite() {
  const [inviteDetails, setInviteDetails] = useState<InviteDetailsType | null>(
    null,
  );
  const navigate = useNavigate();
  const {token} = useParams();

  const {mutate: getInviteDetails} = useMutation({
    mutationFn: () => memberServices.getInviteDetails(token ?? ''),
    onSuccess: data => {
      setInviteDetails(data.data);
    },
    onError: () => {
      toast.error('Error getting invite details');
    },
  });

  const {mutate: acceptInvite, status} = useMutation({
    mutationFn: () => memberServices.acceptInvite(token ?? ''),
    onSuccess: () => {
      toast.success('Invite accepted');
      navigate(`/${ROUTES.updateMemberPassword}`);
    },
    onError: () => {
      toast.error('Error accepting invite');
    },
  });

  useEffect(() => {
    getInviteDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex place-items-center min-h-screen">
      <Card className="mx-auto w-full max-w-[420px]">
        <CardHeader>
          <CardTitle className="text-2xl">Accept Invite</CardTitle>
          <CardDescription>
            {inviteDetails?.inviterInfo.name} has invited you to{' '}
            {inviteDetails?.inviterInfo.BusinessName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            disabled={status === 'pending'}
            onClick={() => acceptInvite()}
          >
            {status === 'pending' ? 'Loading...' : 'Accept Invite'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
