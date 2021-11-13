import { useAuth } from "../authentication/authenticationSlice";

export const Profile = () => {
  const { userProfile } = useAuth();

  return (
    <>
      <div>
        <h1>User Profile:</h1>
        <p>
          Full name: <span className='font-light'>{userProfile.firstName} {userProfile.lastName}</span> 
        </p>
        <p>Email: <span  className='font-light'>{userProfile.email}</span>  </p>
        <p>Phone: <span  className='font-light'>{userProfile.phoneNumber}</span>  </p>
      </div>
    </>
  );
};
