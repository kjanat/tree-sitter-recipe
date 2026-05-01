LANGUAGE_NAME := tree-sitter-recipe
HOMEPAGE_URL := https://github.com/kjanat/tree-sitter-recipe
VERSION := 0.1.0

# repository
SRC_DIR := src

TS ?= tree-sitter

# install directory layout
PREFIX ?= /usr/local
DATADIR ?= $(PREFIX)/share
INCLUDEDIR ?= $(PREFIX)/include
LIBDIR ?= $(PREFIX)/lib
BINDIR ?= $(PREFIX)/bin
PCLIBDIR ?= $(LIBDIR)/pkgconfig

# auto-escalate install/uninstall via sudo when run as non-root,
# unless NO_SUDO=1 is set (used by install-user/uninstall-user)
ifeq ($(filter 0,$(shell id -u))$(NO_SUDO),)
NEEDS_SUDO := 1
endif

# source/object files
PARSER := $(SRC_DIR)/parser.c
EXTRAS := $(filter-out $(PARSER),$(wildcard $(SRC_DIR)/*.c))
OBJS := $(patsubst %.c,%.o,$(PARSER) $(EXTRAS))

# flags
ARFLAGS ?= rcs
override CFLAGS += -I$(SRC_DIR) -std=c11 -fPIC

# ABI versioning
SONAME_MAJOR = $(shell sed -n 's/\#define LANGUAGE_VERSION //p' $(PARSER))
SONAME_MINOR = $(word 1,$(subst ., ,$(VERSION)))

# OS-specific bits
MACHINE := $(shell $(CC) -dumpmachine)

ifneq ($(findstring darwin,$(MACHINE)),)
	SOEXT = dylib
	SOEXTVER_MAJOR = $(SONAME_MAJOR).$(SOEXT)
	SOEXTVER = $(SONAME_MAJOR).$(SONAME_MINOR).$(SOEXT)
	LINKSHARED = -dynamiclib -Wl,-install_name,$(LIBDIR)/lib$(LANGUAGE_NAME).$(SOEXTVER),-rpath,@executable_path/../Frameworks
else ifneq ($(findstring mingw32,$(MACHINE)),)
	SOEXT = dll
	LINKSHARED += -s -shared -Wl,--out-implib,lib$(LANGUAGE_NAME).dll.a
else
	SOEXT = so
	SOEXTVER_MAJOR = $(SOEXT).$(SONAME_MAJOR)
	SOEXTVER = $(SOEXT).$(SONAME_MAJOR).$(SONAME_MINOR)
	LINKSHARED = -shared -Wl,-soname,lib$(LANGUAGE_NAME).$(SOEXTVER)
ifneq ($(filter $(shell uname),FreeBSD NetBSD DragonFly),)
	PCLIBDIR := $(PREFIX)/libdata/pkgconfig
endif
endif

all: lib$(LANGUAGE_NAME).a lib$(LANGUAGE_NAME).$(SOEXT) $(LANGUAGE_NAME).pc

lib$(LANGUAGE_NAME).a: $(OBJS)
	$(AR) $(ARFLAGS) $@ $^

lib$(LANGUAGE_NAME).$(SOEXT): $(OBJS)
	$(CC) $(LDFLAGS) $(LINKSHARED) $^ $(LDLIBS) -o $@
ifneq ($(STRIP),)
	$(STRIP) $@
endif

ifneq ($(findstring mingw32,$(MACHINE)),)
lib$(LANGUAGE_NAME).dll.a: lib$(LANGUAGE_NAME).$(SOEXT)
endif

# marker file: tracks the PREFIX last used to generate the .pc — depending on
# FORCE makes the recipe run every invocation, but it only rewrites the stamp
# (and bumps its mtime) when PREFIX has actually changed. The .pc then
# rebuilds iff the stamp's mtime moved.
.PHONY: FORCE
FORCE:

$(LANGUAGE_NAME).pc.stamp: FORCE
	@[ "$$(cat $@ 2>/dev/null)" = '$(PREFIX)' ] || printf '%s\n' '$(PREFIX)' > $@

$(LANGUAGE_NAME).pc: bindings/c/$(LANGUAGE_NAME).pc.in $(LANGUAGE_NAME).pc.stamp
	sed -e 's|@PROJECT_VERSION@|$(VERSION)|' \
		-e 's|@CMAKE_INSTALL_LIBDIR@|$(LIBDIR:$(PREFIX)/%=%)|' \
		-e 's|@CMAKE_INSTALL_INCLUDEDIR@|$(INCLUDEDIR:$(PREFIX)/%=%)|' \
		-e 's|@PROJECT_DESCRIPTION@|$(DESCRIPTION)|' \
		-e 's|@PROJECT_HOMEPAGE_URL@|$(HOMEPAGE_URL)|' \
		-e 's|@CMAKE_INSTALL_PREFIX@|$(PREFIX)|' $< > $@

$(SRC_DIR)/grammar.json: grammar.js
	$(TS) generate --no-parser $^

$(PARSER): $(SRC_DIR)/grammar.json
	$(TS) generate $^

ifdef NEEDS_SUDO
install: all
	@echo "→ escalating to sudo for system install"
	@exec sudo $(MAKE) -C '$(CURDIR)' install PREFIX='$(PREFIX)' DESTDIR='$(DESTDIR)' NO_SUDO=1
else
install: all
	install -d '$(DESTDIR)$(DATADIR)'/tree-sitter/queries/recipe '$(DESTDIR)$(INCLUDEDIR)'/tree_sitter '$(DESTDIR)$(PCLIBDIR)' '$(DESTDIR)$(LIBDIR)'
	install -m644 bindings/c/tree_sitter/$(LANGUAGE_NAME).h '$(DESTDIR)$(INCLUDEDIR)'/tree_sitter/$(LANGUAGE_NAME).h
	install -m644 $(LANGUAGE_NAME).pc '$(DESTDIR)$(PCLIBDIR)'/$(LANGUAGE_NAME).pc
	install -m644 lib$(LANGUAGE_NAME).a '$(DESTDIR)$(LIBDIR)'/lib$(LANGUAGE_NAME).a
	install -m755 lib$(LANGUAGE_NAME).$(SOEXT) '$(DESTDIR)$(LIBDIR)'/lib$(LANGUAGE_NAME).$(SOEXTVER)
ifneq ($(findstring mingw32,$(MACHINE)),)
	install -d '$(DESTDIR)$(BINDIR)'
	install -m755 lib$(LANGUAGE_NAME).dll '$(DESTDIR)$(BINDIR)'/lib$(LANGUAGE_NAME).dll
	install -m755 lib$(LANGUAGE_NAME).dll.a '$(DESTDIR)$(LIBDIR)'/lib$(LANGUAGE_NAME).dll.a
else
	install -m755 lib$(LANGUAGE_NAME).$(SOEXT) '$(DESTDIR)$(LIBDIR)'/lib$(LANGUAGE_NAME).$(SOEXTVER)
	cd '$(DESTDIR)$(LIBDIR)' && ln -sf lib$(LANGUAGE_NAME).$(SOEXTVER) lib$(LANGUAGE_NAME).$(SOEXTVER_MAJOR)
	cd '$(DESTDIR)$(LIBDIR)' && ln -sf lib$(LANGUAGE_NAME).$(SOEXTVER_MAJOR) lib$(LANGUAGE_NAME).$(SOEXT)
endif
ifneq ($(wildcard queries/*.scm),)
	install -m644 queries/*.scm '$(DESTDIR)$(DATADIR)'/tree-sitter/queries/recipe
endif
endif

install-user:
	$(RM) $(LANGUAGE_NAME).pc
	$(MAKE) install PREFIX='$(HOME)/.local' NO_SUDO=1

ifdef NEEDS_SUDO
uninstall:
	@echo "→ escalating to sudo for system uninstall"
	@exec sudo $(MAKE) -C '$(CURDIR)' uninstall PREFIX='$(PREFIX)' DESTDIR='$(DESTDIR)' NO_SUDO=1
else
uninstall:
	$(RM) '$(DESTDIR)$(LIBDIR)'/lib$(LANGUAGE_NAME).a \
		'$(DESTDIR)$(LIBDIR)'/lib$(LANGUAGE_NAME).$(SOEXTVER) \
		'$(DESTDIR)$(LIBDIR)'/lib$(LANGUAGE_NAME).$(SOEXTVER_MAJOR) \
		'$(DESTDIR)$(LIBDIR)'/lib$(LANGUAGE_NAME).$(SOEXT) \
		'$(DESTDIR)$(INCLUDEDIR)'/tree_sitter/$(LANGUAGE_NAME).h \
		'$(DESTDIR)$(PCLIBDIR)'/$(LANGUAGE_NAME).pc
	$(RM) -r '$(DESTDIR)$(DATADIR)'/tree-sitter/queries/recipe
endif

uninstall-user:
	$(MAKE) uninstall PREFIX='$(HOME)/.local' NO_SUDO=1

clean:
	$(RM) $(OBJS) $(LANGUAGE_NAME).pc $(LANGUAGE_NAME).pc.stamp lib$(LANGUAGE_NAME).a lib$(LANGUAGE_NAME).$(SOEXT) lib$(LANGUAGE_NAME).dll.a

test:
	$(TS) test

.PHONY: all install install-user uninstall uninstall-user clean test
