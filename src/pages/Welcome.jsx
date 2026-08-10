import { useNavigate } from "react-router-dom";
import ScreenLayout from "../components/common/ScreenLayout";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon";
import { brand, icons } from "../config/theme";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <ScreenLayout className="justify-between items-center text-center">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <div className="relative w-44 h-44 flex items-center justify-center">
          <div
            className="absolute inset-[-35%] rounded-full bg-primary/15 blur-3xl animate-glow-in"
            aria-hidden="true"
          />
          <img
            src={brand.logo}
            alt={brand.name}
            className="relative w-full h-full object-contain animate-logo-in"
          />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
          <h1 className="text-[36px] leading-[1.05] text-ink font-bold tracking-tight">
            {brand.name.toUpperCase()}
          </h1>
          <p className="text-ink-secondary text-lg mt-2.5">{brand.tagline}</p>
        </div>
      </div>

      <div className="w-full pb-4 animate-fade-in" style={{ animationDelay: "250ms" }}>
        <Button onClick={() => navigate("/genero")}>
          COMENZAR
          <Icon name={icons.siguiente} size={18} />
        </Button>
      </div>
    </ScreenLayout>
  );
}
