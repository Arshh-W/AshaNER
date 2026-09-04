cmake_minimum_required(VERSION 3.22)
project(MaceCognitiveEngine C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

set(ORT_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/external/onnxruntime)
set(SQLITE_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/external/sqlite3)

include_directories(
    ${CMAKE_CURRENT_SOURCE_DIR}/engine/include
    ${ORT_ROOT}/include
    ${SQLITE_ROOT}
)

add_library(sqlite3 STATIC ${SQLITE_ROOT}/sqlite3.c)
target_compile_definitions(sqlite3 PRIVATE
    SQLITE_THREADSAFE=1
    SQLITE_ENABLE_JSON1
)

add_library(onnxruntime SHARED IMPORTED)
if(WIN32)
    set_target_properties(onnxruntime PROPERTIES
        IMPORTED_IMPLIB "${ORT_ROOT}/lib/onnxruntime.lib"
        IMPORTED_LOCATION "${ORT_ROOT}/lib/onnxruntime.dll"
        INTERFACE_INCLUDE_DIRECTORIES "${ORT_ROOT}/include"
    )
elseif(APPLE)
    set_target_properties(onnxruntime PROPERTIES
        IMPORTED_LOCATION "${ORT_ROOT}/lib/libonnxruntime.dylib"
        INTERFACE_INCLUDE_DIRECTORIES "${ORT_ROOT}/include"
    )
else()
    set_target_properties(onnxruntime PROPERTIES
        IMPORTED_LOCATION "${ORT_ROOT}/lib/libonnxruntime.so"
        INTERFACE_INCLUDE_DIRECTORIES "${ORT_ROOT}/include"
    )
endif()

file(GLOB_RECURSE ENGINE_SOURCES "${CMAKE_CURRENT_SOURCE_DIR}/engine/src/*.cpp")
add_executable(mace_core ${ENGINE_SOURCES})
target_link_libraries(mace_core PRIVATE onnxruntime sqlite3)

if(NOT WIN32)
    target_link_libraries(mace_core PRIVATE pthread dl)
    set_target_properties(mace_core PROPERTIES
        BUILD_RPATH "${ORT_ROOT}/lib"
        INSTALL_RPATH "${ORT_ROOT}/lib"
    )
else()
    add_custom_command(TARGET mace_core POST_BUILD
        COMMAND ${CMAKE_COMMAND} -E copy_if_different
        "${ORT_ROOT}/lib/onnxruntime.dll"
        $<TARGET_FILE_DIR:mace_core>
    )
endif()