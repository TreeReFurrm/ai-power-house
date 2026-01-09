# TODO: Remove Firebase Dependencies

## Step 1: Delete Firebase-specific configuration files
- [x] Delete `firebase.json`
- [x] Delete `firestore.rules`
- [x] Delete `apphosting.yaml`

## Step 2: Delete Firebase source directory
- [x] Delete entire `src/firebase/` directory

## Step 3: Update app layout and providers
- [x] No FirebaseClientProvider found in layout files

## Step 4: Update auth hooks and create shim
- [x] Updated `src/hooks/use-auth.ts` to be a complete mock auth system
- [x] No shim needed - no other files import from @/firebase

## Step 5: Update components using Firebase
- [x] Deleted unused `FirebaseErrorListener` component

## Step 6: Clean up package.json (optional)
- [x] No firebase dependencies in package.json (never added)

## Step 7: Test the build
- [ ] Run `npm run build` to verify everything works

