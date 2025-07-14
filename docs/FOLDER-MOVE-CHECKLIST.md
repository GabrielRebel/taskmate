# Project Folder Move Checklist

**Purpose**: Ensure all functionality works after moving a project to a new location

## Pre-Move Checklist

### 1. Document Current State
- [ ] Take screenshots of working functionality
- [ ] Note current working configuration
- [ ] Document any environment-specific settings
- [ ] Test all major features and note results

### 2. Identify Critical Files
- [ ] `.env` files (API keys, environment variables)
- [ ] Database files (`.db`, `.sqlite`)
- [ ] Configuration files (`.config`, `.json`)
- [ ] Hidden files (`.gitignore`, `.env`, etc.)
- [ ] Node modules and dependencies

## Move Process

### 3. Execute Move
- [ ] Copy entire project folder to new location
- [ ] Verify all files transferred (including hidden files)
- [ ] Update any hardcoded paths in scripts or configs
- [ ] Update documentation references

### 4. Post-Move Setup

#### Environment Files
- [ ] **CRITICAL**: Recreate `.env` files in new location
- [ ] Copy API keys and environment variables
- [ ] Update any path references in `.env` files
- [ ] Test environment variable loading

#### Dependencies
- [ ] Reinstall dependencies in new location
- [ ] Check for version conflicts
- [ ] Resolve any missing modules
- [ ] Test build process

#### Configuration
- [ ] Update any hardcoded paths in code
- [ ] Check proxy settings in `package.json`
- [ ] Verify CORS settings
- [ ] Test database connections

## Post-Move Testing

### 5. Backend Testing
- [ ] Start backend server
- [ ] Verify environment variables load correctly
- [ ] Test health endpoint: `http://localhost:5000/api/health`
- [ ] Test provider status: `http://localhost:5000/api/chat/providers`
- [ ] Check for any error messages in console

### 6. Frontend Testing
- [ ] Start frontend server
- [ ] Verify it loads without errors
- [ ] Test API communication with backend
- [ ] Check browser console for errors
- [ ] Test all major features

### 7. Integration Testing
- [ ] Test chat functionality
- [ ] Test task creation/extraction
- [ ] Test notifications
- [ ] Test missions
- [ ] Verify all data persistence

## Common Issues & Solutions

### Environment Variables Not Loading
- **Symptom**: Backend shows "Not set" for API keys
- **Cause**: `.env` file not copied or in wrong location
- **Solution**: Manually recreate `.env` file in backend directory

### API Communication Failing
- **Symptom**: Frontend can't reach backend
- **Cause**: Wrong URLs or proxy configuration
- **Solution**: Update API calls to use full URLs or fix proxy

### Dependencies Missing
- **Symptom**: Module not found errors
- **Cause**: `node_modules` not properly installed
- **Solution**: Run `npm install` in both frontend and backend

### Database Issues
- **Symptom**: Data not persisting
- **Cause**: Database file not moved or wrong path
- **Solution**: Copy database files and update paths

## Documentation Updates

### 8. Update Documentation
- [ ] Update README files with new paths
- [ ] Update setup instructions
- [ ] Update any hardcoded URLs in documentation
- [ ] Create session summary documenting the move

### 9. Version Control
- [ ] Commit changes to git
- [ ] Update any deployment scripts
- [ ] Test deployment process if applicable

## Success Criteria

- [ ] All features work as before the move
- [ ] No console errors in browser or terminal
- [ ] API calls return expected responses
- [ ] Environment variables load correctly
- [ ] Documentation is updated and accurate

## Emergency Rollback

If issues persist:
1. Keep original folder as backup
2. Document all issues encountered
3. Consider moving back to original location
4. Plan move with more detailed testing

---

**Remember**: Always test thoroughly after any move operation. What works in one location may not work in another due to path differences, environment variables, or configuration issues. 