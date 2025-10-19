import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Recycle, BookOpen, Leaf, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Recycle className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Waste Management
            <span className="block text-primary mt-2">Content Hub</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your comprehensive platform for managing articles, resources, and insights about waste management, recycling, and sustainability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="gap-2 text-lg px-8 py-6"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow">
              <BookOpen className="w-10 h-10 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Article Management</h3>
              <p className="text-sm text-muted-foreground">
                Create, edit, and organize your waste management content efficiently
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow">
              <Recycle className="w-10 h-10 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Categorization</h3>
              <p className="text-sm text-muted-foreground">
                Sort by recycling, composting, e-waste, and more categories
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-shadow">
              <Leaf className="w-10 h-10 text-primary mb-3 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Sustainability Focus</h3>
              <p className="text-sm text-muted-foreground">
                Promote eco-friendly practices and zero waste initiatives
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
