const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center flex-col">
      {children}
    </div>
  );
};

export default ClerkLayout;
