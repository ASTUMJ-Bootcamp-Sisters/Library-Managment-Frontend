import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SignupForm } from '../components/signup-form';
import { Button } from '../components/ui/button';

const SignUp = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6" 
      style={{ backgroundImage: "url('/bookshelf.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 w-full max-w-sm md:max-w-3xl">
        <SignupForm />
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="bg-white bg-opacity-90 hover:bg-opacity-100 text-white">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SignUp;
