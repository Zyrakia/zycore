> **Big Disclaimer Time** <br>
> I made this package with my project/future project needs in mind. This means that I will go into this package and change things whenever I need something changed for my project. To be short, expect breaking changes, changes that may affect your project and the way it behaves, so if you need something in this package, either install it and then don't update unless you know what has changed, or go grab only the utilities you need from the repo.

# Zycore

Just a bunch of utilities thrown together since I don't like copying the files between my projects manually.
Feel free to contribute any new utilities or corrections.
This package exports quite a few very generically named namespaces and classes, if you would like to avoid that kind of pollution installing this package is not your best choice. The repo will always remain open so if you want to grab a specific namespace or class go ahead :D

Some utilities may use other utilities internally, so check the imports at the top if you grab a file to make sure you are grabbing all of the files you need to get the full functionality.

# List of Utilities

Below is a short list of utilities and a concise description, full method-by-method documentation is provided in the doc-comments.

### <b>Arrays</b> - immutable utility functions for working with arrays.

```
- pickRandom()
- pickWeightedRandom()
- equals()
- clone()
- shuffle()
- reverse()
- slice()
- lower()
- upper()
- flatten()
```

### <b>Benchmark</b> - utility functions for benchmarking code and display the results in appropriate formats.

```
run()
start()
stop()
runDebug()

BenchmarkResult
getMessage()
write()
writeIfClient()
writeIfServer()
writeIfStudio()
writeIf()
getSeconds()
getSecondsPerRun()
getMillis()
getMillisPerRun()
getMicros()
getMicrosPerRun()
```

### <b>InstanceTree</b> - utility functions for working with instances and instance trees.

```
walk()
walkNear()
walkFilter()
walkNearFilter()
gatherAncestors()
gatherAncestorsFilter()
isUIVisible()
onUIVisibilityChange()
findHighestAncestorNotOfClass()
cloneUnlock()
cloneLock()
onDestroying()
onDeparented()
findChildOfClassThorough()
findChildOfClass()
findReferencedChildOfClass()
toggle()
hasProperty()
```

### <b>Numbers</b> - utility functions for working with numbers.

```
spread()
sequence()
isInteger()
isEven()
isOdd()
truncate()
randomOffset()
SUID()
```

### <b>Debouncer</b> - utility class for checking whether an interval has passed between calls.

```
try()
check()
lock()
unlock()
isLocked()
setTimeout()
getTimeout()
reset()
getLast()
```

### <b>DebouncerMap</b> - exposes the same API as a debouncer, but dynamically creates debouncers for keys and keeps track of them.

```
Features all of the debouncer methods +
lockAll()
unlockAll()
clear()
setTimeoutAll()
resetAll()
has()
```

### <b>Interval & Timeout</b> - Feature replication of the JS setTimeout and setInterval functions.

```
setTimeout()
setInterval()
setIntervalNow()
```

### <b>Colors</b> - utility functions for working with colors.

```
RGB()
random()
sequence()
A bunch of static colors.
```

### <b>Strings</b> - utility functions for working with strings.

```
randomChar()
random()
trim()
trimStart()
trimEnd()
startsWith()
endsWith()
slice()
includes()
lastCamel()
extractNumbers()
truncate()
padEnd()
padStart()
```

### <b>Character</b> - utility functions for working with Roblox characters.

```
get()
getAsync()
getHum()
waitHum()
getRoot()
waitRoot()
getAnimator()
waitAnimator()
stand()
teleport()
forceUnequip()
getAnimationScript()
getAnimationForState()
```

### <b>BinMap</b> - same concept as DebouncerMap, but for the Bin library written by Osyris.

```
addAll()
destroyAll()
deleteAll()
```

### <b>GroupRanker</b> - utility class for assigning identifiers to players based on their rank in a Roblox group according to a customizable mapping.

```
get()
force()
forget()
destroy()
setMapping()
```

### <b>UpdateSquasher</b> - utility class for delaying abstract updates so in a specific timeframe, all updates are squashed until the delay is over, and then the latest update is 'published'.

```
push()
get()
publish()
```

### <b>CharacterWatcher</b> - utility class for watching character added/removed events on a specific player.

```
onAdded
onRemoving
watch()
destroy()
```

### <b>GlobalCharacterWatcher</b> - same concept as the CharacterWatcher, but watches all players instead of a specific player.

```
onAdded
onRemoving
watch()
destroy()
```

### <b>Debris</b> - utility functions for working with debris instances.

```
defaultLifetime
add()
addSink()
```

### <b>Asset</b> - utility functions for working with Roblox asset-related things.

```
prefix()
thumbnail()
preload()
preloadPromise()
preloadCreate()
preloadReturn()
```

### <b>LevelPermissionManager</b> - utility class for keeping track and assigning permission levels to players and comparing those permission levels.

```
getLevel()
setLevel()
removeLevel()
isMaster()
isAboveLevel()
isAbove()
isEqualLevel()
isEqual()
isAboveOrEqualLevel()
isAboveOrEqual()
getDefaultLevel()
setDefaultLevel()
getMasterLevel()
setMasterLevvel()
clear()
```

### <b>CacheMap</b> - utility class for keeping track of key/values for a certain amount of time.

```
get()
set()
has()
forget()
clear()
getExpirationSeconds()
setExpirationSeconds()
setGetter()
```

### <b>Objects</b> - utility functions for working with objects.

```
sortedPairs()
```

### <b>Users</b> - utility functions for working with users (players).

```
getFullName()
```

### <b>Tags</b> - utility functions for working with CollectionService tags.

```
add()
remove()
has()
getTagged()
getTags()
onAdded()
onRemoved()
```

### <b>PartEffects</b> - utility functions for animating BaseParts.

```
sink()
```

### <b>Log</b> - utility functions for logging preset or dynamic messages with optional prefix / suffix.

```
prefix
suffix
mapping

info()
warning()
err()
errNonFatal()
```

### <b>Time</b> - utility functions for working with time and time units.

```
now()
localNow()
diff()
convert()
secondsToReadable()
toClock()
toClockHoursMinutes()
toClockMinutesSeconds()
```
