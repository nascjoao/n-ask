import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validate as validateUUID } from 'uuid';
import supabase from '../supabaseClient';

export default function useValidateRoom(id) {
  const navigate = useNavigate();
  const [roomFound, setRoomFound] = useState(false);
  const goToNotFound = () => navigate('/room/not-found', { replace: true });
  useEffect(() => {
    const validUUID = validateUUID(id);
    if (!validUUID) goToNotFound();

    (async () => {
      if (validUUID) {
        const { data, error } = await supabase.from('rooms').select().eq('id', id);
        if (!data || !data.length || error) {
          goToNotFound();
        } else {
          setRoomFound(true);
        }
      }
    })();
  }, []);

  return roomFound;
}
