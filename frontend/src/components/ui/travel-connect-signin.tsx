import React, { useRef, useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const cn = (...classes: string[]) => classes.filter(Boolean).join(" ");

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

const Button = ({ children, variant = "default", className = "", ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2D8E] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variantStyles = {
    default: "bg-primary bg-gradient-to-r from-[#7B2D8E] to-[#00B4A6] text-white hover:from-[#5C1F6A] hover:to-[#008F84]",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };
  return <button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>{children}</button>;
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = ({ className = "", ...props }: InputProps) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm text-gray-800 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B2D8E] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

type RoutePoint = { x: number; y: number; delay: number };

const DotMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const routes: { start: RoutePoint; end: RoutePoint; color: string }[] = [
    { start: { x: 100, y: 150, delay: 0 }, end: { x: 200, y: 80, delay: 2 }, color: "#7B2D8E" },
    { start: { x: 200, y: 80, delay: 2 }, end: { x: 260, y: 120, delay: 4 }, color: "#00B4A6" },
    { start: { x: 50, y: 50, delay: 1 }, end: { x: 150, y: 180, delay: 3 }, color: "#7B2D8E" },
    { start: { x: 280, y: 60, delay: 0.5 }, end: { x: 180, y: 180, delay: 2.5 }, color: "#00B4A6" }
  ];

  const generateDots = (width: number, height: number) => {
    const dots = [];
    const gap = 12;
    for (let x = 0; x < width; x += gap) {
      for (let y = 0; y < height; y += gap) {
        const isInMapShape =
          ((x < width * 0.25 && x > width * 0.05) && (y < height * 0.4 && y > height * 0.1)) ||
          ((x < width * 0.25 && x > width * 0.15) && (y < height * 0.8 && y > height * 0.4)) ||
          ((x < width * 0.45 && x > width * 0.3) && (y < height * 0.35 && y > height * 0.15)) ||
          ((x < width * 0.5 && x > width * 0.35) && (y < height * 0.65 && y > height * 0.35)) ||
          ((x < width * 0.7 && x > width * 0.45) && (y < height * 0.5 && y > height * 0.1)) ||
          ((x < width * 0.8 && x > width * 0.65) && (y < height * 0.8 && y > height * 0.6));
        if (isInMapShape && Math.random() > 0.3) {
          dots.push({ x, y, radius: 1, opacity: Math.random() * 0.5 + 0.2 });
        }
      }
    }
    return dots;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
      canvas.width = width;
      canvas.height = height;
    });
    resizeObserver.observe(canvas.parentElement as Element);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dots = generateDots(dimensions.width, dimensions.height);
    let animationFrameId: number;
    let startTime = Date.now();

    function drawDots() {
      ctx!.clearRect(0, 0, dimensions.width, dimensions.height);
      dots.forEach(dot => {
        ctx!.beginPath();
        ctx!.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(123, 45, 142, ${dot.opacity})`;
        ctx!.fill();
      });
    }

    function drawRoutes() {
      const currentTime = (Date.now() - startTime) / 1000;
      routes.forEach(route => {
        const elapsed = currentTime - route.start.delay;
        if (elapsed <= 0) return;
        const progress = Math.min(elapsed / 3, 1);
        const x = route.start.x + (route.end.x - route.start.x) * progress;
        const y = route.start.y + (route.end.y - route.start.y) * progress;
        
        ctx!.beginPath();
        ctx!.moveTo(route.start.x, route.start.y);
        ctx!.lineTo(x, y);
        ctx!.strokeStyle = route.color;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        
        ctx!.beginPath();
        ctx!.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = route.color;
        ctx!.fill();
        
        ctx!.beginPath();
        ctx!.arc(x, y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = route.color;
        ctx!.fill();
        
        ctx!.beginPath();
        ctx!.arc(x, y, 6, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(0, 180, 166, 0.4)";
        ctx!.fill();
        
        if (progress === 1) {
          ctx!.beginPath();
          ctx!.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
          ctx!.fillStyle = route.color;
          ctx!.fill();
        }
      });
    }
    
    function animate() {
      drawDots();
      drawRoutes();
      const currentTime = (Date.now() - startTime) / 1000;
      if (currentTime > 15) startTime = Date.now();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export const AuthCard = ({ isLogin = true }: { isLogin?: boolean }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [accountType, setAccountType] = useState<'INDIVIDUAL' | 'COMPANY'>('INDIVIDUAL');
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Pre-fill promo code from URL
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) setPromoCode(ref.toUpperCase());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        if (!email || !password) { setError('Veuillez remplir tous les champs'); return; }
        const success = await login(email, password);
        if (success) navigate("/");
        else setError("Email ou mot de passe incorrect");
      } else {
        if (!name || !email || !password) { setError("Veuillez remplir tous les champs obligatoires"); return; }
        const result = await register(name, email, password, promoCode || undefined, accountType);
        if (result.success) {
          if (result.discountApplied) {
            setSuccessMsg(`🎉 Code appliqué ! Vous bénéficiez de ${result.discount}% de réduction sur votre premier abonnement.`);
            setTimeout(() => navigate("/membership"), 2200);
          } else {
            navigate("/");
          }
        } else {
          setError("Erreur lors de l'inscription");
        }
      }
    } catch {
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-130px)] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white shadow-xl min-h-[600px]"
      >
        <div className="hidden md:block w-1/2 relative overflow-hidden border-r border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f5ff] to-[#f0ebf8]">
            <DotMap />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mb-6"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#7B2D8E] to-[#00B4A6] flex items-center justify-center shadow-lg shadow-purple-200">
                  <ArrowRight className="text-white h-8 w-8" />
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-4xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#7B2D8E] to-[#00B4A6]"
              >
                P@TH
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-sm text-center text-gray-700 max-w-xs font-medium"
              >
                Rejoignez la plus grande communauté des professionnels des Ressources Humaines au Maroc
              </motion.p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white overflow-y-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">
              {isLogin ? 'Bon retour parmi nous' : 'Créer un compte'}
            </h1>
            <p className="text-gray-500 mb-8">
              {isLogin ? 'Connectez-vous à votre espace' : 'Rejoignez la communauté P@TH'}
            </p>

            {error && <div className="mb-4 text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">{error}</div>}
            {successMsg && <div className="mb-4 text-emerald-700 text-sm font-semibold bg-emerald-50 border border-emerald-200 p-3 rounded-lg">{successMsg}</div>}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                    Nom complet <span className="text-[#00B4A6]">*</span>
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ahmed Hassan"
                    className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full focus:border-[#7B2D8E]"
                  />
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email <span className="text-[#00B4A6]">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full focus:border-[#7B2D8E]"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                  Mot de passe <span className="text-[#00B4A6]">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full pr-10 focus:border-[#7B2D8E]"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-[#7B2D8E]"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isLogin && (
                  <div className="flex justify-end mt-1">
                    <Link to="/forgot-password" className="text-xs text-[#7B2D8E] font-medium hover:underline">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                )}
              </div>

              {/* ── Register-only fields ── */}
              {!isLogin && (
                <>
                  {/* Account type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Type de compte</label>
                    <div className="flex gap-3">
                      {(['INDIVIDUAL', 'COMPANY'] as const).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAccountType(type)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                            accountType === type
                              ? 'border-[#7B2D8E] bg-purple-50 text-[#7B2D8E]'
                              : 'border-gray-200 bg-gray-50 text-gray-600'
                          }`}
                        >
                          {type === 'INDIVIDUAL' ? '👤 Particulier' : '🏢 Entreprise'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Promo / referral code */}
                  <div>
                    <label htmlFor="promoCode" className="block text-sm font-semibold text-gray-700 mb-1">
                      🏷️ Code de parrainage / promo <span className="font-normal text-gray-400">(optionnel)</span>
                    </label>
                    <Input
                      id="promoCode"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="PATH-XXXXXX"
                      className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full focus:border-[#00B4A6] font-mono tracking-wider"
                    />
                    <p className="text-xs text-gray-400 mt-1">Obtenez 10% de réduction sur votre premier abonnement</p>
                  </div>
                </>
              )}
              
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="pt-2"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full bg-gradient-to-r relative overflow-hidden from-[#7B2D8E] to-[#00B4A6] hover:from-[#5C1F6A] hover:to-[#008F84] text-white py-6 text-base font-bold rounded-lg transition-all duration-300",
                    isHovered ? "shadow-lg shadow-purple-200" : ""
                  )}
                >
                  <span className="flex items-center justify-center">
                    {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : 'Créer mon compte')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                  {isHovered && (
                    <motion.span
                      initial={{ left: "-100%" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                      className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      style={{ filter: "blur(8px)" }}
                    />
                  )}
                </Button>
              </motion.div>
              
              <div className="text-center mt-6">
                {isLogin ? (
                  <p className="text-gray-600 text-sm">
                    Pas encore de compte ? <Link to="/register" className="text-[#00B4A6] font-bold hover:underline">Créer un compte</Link>
                  </p>
                ) : (
                  <p className="text-gray-600 text-sm">
                    Déjà inscrit ? <Link to="/login" className="text-[#00B4A6] font-bold hover:underline">Se connecter</Link>
                  </p>
                )}
              </div>
              
              {isLogin && (
                <div className="text-center mt-4 text-xs text-gray-400 bg-gray-50 p-2 rounded">
                  🔑 <strong>Démo admin :</strong> admin@hrplatform.ma (Mot de passe: admin)
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
