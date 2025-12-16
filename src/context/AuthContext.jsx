useEffect(() => {
  const loadSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      await fetchProfile(currentUser.id);
    }

    setLoading(false);
  };

  loadSession();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (_event, session) => {
    setLoading(true);

    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      await fetchProfile(currentUser.id);
    } else {
      setProfile(null);
    }

    setLoading(false);
  });

  return () => subscription.unsubscribe();
}, []);