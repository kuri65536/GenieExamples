// Copyright (c) 2018, shimoda as kuri65536 _dot_ hot mail _dot_ com
//                       ( email address: convert _dot_ to . and joint string )
//
// This Source Code Form is subject to the terms of the Mozilla Public License,
// v.2.0. If a copy of the MPL was not distributed with this file,
// You can obtain one at https://mozilla.org/MPL/2.0/.
[indent=4]
init
    if args.length < 3
        pass
    else if args[1] == "--opt"
        //  var num = args[2]
        //  var fname = args[3]
        //  print(@"$num, $fname")
        main_extract_opt(args[2], args[3])
        return
    main_extract_src(args[1], args[2])


def get_int(num: string): int
    n: int64
    if int64.try_parse(num, out n)
        return (int)n
    return 1


delegate Eachline(line: string)


def main_extract_src(num: string, fname: string): int
    main_extract(num, fname, "genie", src_filter)
    return 0

def src_filter(line: string)
    print(line)


def main_extract_opt(num: string, fname: string): int
    main_extract(num, fname, "shell", opt_filter)
    return 0


def opt_filter(line: string)
    if line.contains("--pkg")
        for i in line.split(" ")
            if i == "-X"
                print("-X")
            if i.has_suffix(".vapi")
                print(i)
            if i.has_prefix("-I")
                print(i)
            if i.has_prefix("-l")
                print(i)
            if i.has_prefix("--pkg")
                print(i)


def main_extract(num: string, fname: string, key: string, cb: Eachline): int
    var n = get_int(num)
    var file = File.new_for_path(fname);
    if not file.query_exists()
        return 1

    var f_in_src = false
    var cur = 1
    dis: DataInputStream = null
    try
        dis = new DataInputStream(file.read())
    except e: GLib.Error
        pass
    try
        line: string
        while ((line = dis.read_line()) != null)
            if f_in_src and is_term_of_code(line)
                f_in_src = false
                cur += 1
            if f_in_src and cur == n
                cb(line)
            if is_begin_of_code(line, key)
                f_in_src = true
    except e: GLib.Error
        pass
    finally
        pass
    return 0


def is_term_of_code(_line: string): bool
    var line = _line.strip()
    if line.has_prefix("```")
        return true
    return false


def is_begin_of_code(_line: string, key: string): bool
    var line = _line.strip()
    if line.has_prefix("```" + key)
        return true
    return false


def is_begin_of_source(_line: string): bool
    var line = _line.strip()
    if line.has_prefix("```genie")
        return true
    return false

// vi: ft=genie:et:ts=4:sw=4
