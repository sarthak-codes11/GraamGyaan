import { useRouter } from "next/router";
import AdvancedMathModule from "./advanced-math";

// Route handler for different modules
export default function ModulePage() {
  const router = useRouter();
  const { moduleId } = router.query;

  // Route to specific module components
  switch (moduleId) {
    case "advanced-math":
      return <AdvancedMathModule />;
    
    // Add more modules here as they are created
    case "science-lab":
      return <div>Science Lab Module - Coming Soon!</div>;
    
    case "coding-basics":
      return <div>Programming Fundamentals Module - Coming Soon!</div>;
    
    case "language-master":
      return <div>Language Mastery Module - Coming Soon!</div>;
    
    default:
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Module Not Found</h1>
            <p className="text-gray-600">The requested module could not be found.</p>
          </div>
        </div>
      );
  }
}
