import { useEffect } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import { useDispatch } from 'react-redux';
import { logIn } from '../redux/slices/authSlice';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebaseconfig';
import { doc, onSnapshot } from 'firebase/firestore';

function AdminLayout({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        onSnapshot(doc(db, 'users', currentUser?.uid), (doc) => {
          console.log('Current user: ', doc.data());
          const user = doc.data();
          dispatch(
            logIn({
              userName: user.lastName + ' ' + user.firstName,
              userEmail: user.email,
              userRole: user.role,
              userId: currentUser?.uid,
            })
          );
        });
      }
    });
  }, []);

  return (
    <div>
      <Nav />
      <Sidebar />
      <div class="p-4 sm:ml-64 mt-[68px]">
        <div class="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
