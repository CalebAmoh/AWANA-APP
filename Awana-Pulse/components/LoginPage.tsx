import React, { useState } from 'react';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck, Sparkles, LayoutGrid } from 'lucide-react';
import { Button, Input, Label } from './ui';
import { Backend } from '../services/backend';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await Backend.login(email, password);
      if (success) {
        onLogin();
      } else {
        setError('Invalid email or password. Try admin@awana.org / password');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-emerald-500/5 rounded-full blur-[80px]"></div>
      </div>

      {/* Main Card Container - Split Layout */}
      <div className="w-full max-w-6xl h-auto min-h-[600px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden flex flex-col lg:flex-row z-10 animate-in zoom-in-95 duration-500 border border-slate-200 dark:border-slate-800">
        
        {/* Left Side - Hero/Branding */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative p-12 flex flex-col justify-between text-white overflow-hidden">
            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            
            {/* Decorative Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-12">
                     <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                        <span className="font-bold text-xl">A</span>
                     </div>
                     <span className="font-bold text-xl tracking-wide text-white/90">AwanaPulse</span>
                </div>
                
                <div className="space-y-6 max-w-md">
                    <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
                        Inspiring the <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">Next Generation</span>
                    </h1>
                    <p className="text-blue-100 text-lg leading-relaxed font-medium opacity-90">
                        Empower your ministry with tools to track progress, manage attendance, and celebrate every milestone in a child's spiritual journey.
                    </p>
                </div>
            </div>

            <div className="relative z-10 mt-12 lg:mt-0">
                 {/* Feature Highlights */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-sm font-semibold text-white/90 bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                        <LayoutGrid size={20} className="text-cyan-300" />
                        <span>Intuitive Dashboard</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-white/90 bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                        <Sparkles size={20} className="text-amber-300" />
                        <span>AI Coaching Tips</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-white/90 bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                        <ShieldCheck size={20} className="text-emerald-300" />
                        <span>Secure Data</span>
                    </div>
                 </div>
            </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white dark:bg-slate-900 relative">
             <div className="max-w-md mx-auto w-full space-y-8">
                
                <div className="text-center lg:text-left space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base">
                        Please enter your details to sign in.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-11 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold">Password</Label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="pl-11 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all rounded-xl"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex items-start gap-3 animate-in slide-in-from-top-2">
                             <div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0"></div>
                             <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Verifying...
                            </>
                        ) : (
                            <>
                            Sign In <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </Button>
                    
                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-semibold tracking-wider">Demo Access</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400">
                        <p className="mb-1">Email: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">admin@awana.org</span></p>
                        <p>Password: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">password</span></p>
                    </div>
                </form>
             </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;