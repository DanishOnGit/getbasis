import { useAuth } from "../authentication/authenticationSlice";

export const Profile = () => {
  const { userProfile } = useAuth();
   console.log('Profile jsx',userProfile)
  return (
    <>
      <div>
        <p>
          Full name: {userProfile.firstName} {userProfile.lastName}
        </p>
        <p>Email: {userProfile.email} </p>
        <p>Phone: {userProfile.phoneNumber} </p>
      </div>
    </>
  );
};
