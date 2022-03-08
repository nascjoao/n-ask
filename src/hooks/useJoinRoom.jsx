import {
  useContext,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import useValidateRoom from './useValidateRoom';
import supabase from '../supabaseClient';
import { userContext } from '../contexts/User';

export default function useJoinRoom(roomId) {
  const roomIsValid = useValidateRoom(roomId);
  const userId = localStorage.getItem('user');
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (roomIsValid) {
      (async () => {
        if (userId) {
          const { data } = await supabase.from('users').select().eq('id', userId);
          if (data && data.length > 0) {
            if (data[0].roomId !== roomId) {
              navigate(`/room/${data[0].roomId}`, {
                state: {
                  abandoned: true,
                },
                replace: true,
              });
            }
            setUser({ id: data[0].id, name: data[0].name });
          } else {
            navigate('/room/identification', {
              state: {
                roomId,
              },
              replace: true,
            });
          }
        } else {
          navigate('/room/identification', {
            state: {
              roomId,
            },
            replace: true,
          });
        }
      })();
    }
  }, [roomIsValid]);

  return { user };
}
